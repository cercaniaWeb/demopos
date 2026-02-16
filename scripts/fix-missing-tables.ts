/**
 * Script para crear las tablas faltantes en Supabase
 * Ejecutar con: npx tsx scripts/fix-missing-tables.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan credenciales de Supabase en .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSupplierVisitsTable() {
    console.log('\n📦 Creando tabla supplier_visits...');

    const { error } = await supabase.rpc('exec_sql', {
        sql: `
      -- Tabla para registrar visitas de proveedores
      CREATE TABLE IF NOT EXISTS public.supplier_visits (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
        supplier_name VARCHAR(255) NOT NULL,
        visit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        notes TEXT,
        products_delivered JSONB DEFAULT '[]'::jsonb,
        total_amount DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by UUID REFERENCES auth.users(id)
      );

      -- Índices para mejorar rendimiento
      CREATE INDEX IF NOT EXISTS idx_supplier_visits_store_id ON public.supplier_visits(store_id);
      CREATE INDEX IF NOT EXISTS idx_supplier_visits_visit_date ON public.supplier_visits(visit_date);

      -- Habilitar RLS
      ALTER TABLE public.supplier_visits ENABLE ROW LEVEL SECURITY;

      -- Políticas de seguridad
      CREATE POLICY IF NOT EXISTS "Users can view supplier visits from their store"
        ON public.supplier_visits FOR SELECT
        USING (
          store_id IN (
            SELECT store_id FROM public.user_stores 
            WHERE user_id = auth.uid()
          )
        );

      CREATE POLICY IF NOT EXISTS "Users can insert supplier visits to their store"
        ON public.supplier_visits FOR INSERT
        WITH CHECK (
          store_id IN (
            SELECT store_id FROM public.user_stores 
            WHERE user_id = auth.uid()
          )
        );

      CREATE POLICY IF NOT EXISTS "Users can update supplier visits from their store"
        ON public.supplier_visits FOR UPDATE
        USING (
          store_id IN (
            SELECT store_id FROM public.user_stores 
            WHERE user_id = auth.uid()
          )
        );
    `
    });

    if (error) {
        console.error('❌ Error creando supplier_visits:', error);
        throw error;
    }

    console.log('✅ Tabla supplier_visits creada exitosamente');
}

async function createExpiringProductsTable() {
    console.log('\n📦 Creando tabla expiring_products...');

    const { error } = await supabase.rpc('exec_sql', {
        sql: `
      -- Tabla para productos próximos a caducar
      CREATE TABLE IF NOT EXISTS public.expiring_products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
        store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
        batch_number VARCHAR(100),
        expiry_date DATE NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        cost_price DECIMAL(10, 2),
        selling_price DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'near_expiry', 'expired', 'disposed')),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(product_id, store_id, batch_number, expiry_date)
      );

      -- Índices
      CREATE INDEX IF NOT EXISTS idx_expiring_products_product_id ON public.expiring_products(product_id);
      CREATE INDEX IF NOT EXISTS idx_expiring_products_store_id ON public.expiring_products(store_id);
      CREATE INDEX IF NOT EXISTS idx_expiring_products_expiry_date ON public.expiring_products(expiry_date);
      CREATE INDEX IF NOT EXISTS idx_expiring_products_status ON public.expiring_products(status);

      -- Índice para búsquedas de productos próximos a caducar
      CREATE INDEX IF NOT EXISTS idx_expiring_products_near_expiry 
        ON public.expiring_products(store_id, expiry_date) 
        WHERE status = 'active';

      -- Habilitar RLS
      ALTER TABLE public.expiring_products ENABLE ROW LEVEL SECURITY;

      -- Políticas de seguridad
      CREATE POLICY IF NOT EXISTS "Users can view expiring products from their store"
        ON public.expiring_products FOR SELECT
        USING (
          store_id IN (
            SELECT store_id FROM public.user_stores 
            WHERE user_id = auth.uid()
          )
        );

      CREATE POLICY IF NOT EXISTS "Users can insert expiring products to their store"
        ON public.expiring_products FOR INSERT
        WITH CHECK (
          store_id IN (
            SELECT store_id FROM public.user_stores 
            WHERE user_id = auth.uid()
          )
        );

      CREATE POLICY IF NOT EXISTS "Users can update expiring products from their store"
        ON public.expiring_products FOR UPDATE
        USING (
          store_id IN (
            SELECT store_id FROM public.user_stores 
            WHERE user_id = auth.uid()
          )
        );

      CREATE POLICY IF NOT EXISTS "Users can delete expiring products from their store"
        ON public.expiring_products FOR DELETE
        USING (
          store_id IN (
            SELECT store_id FROM public.user_stores 
            WHERE user_id = auth.uid()
          )
        );
    `
    });

    if (error) {
        console.error('❌ Error creando expiring_products:', error);
        throw error;
    }

    console.log('✅ Tabla expiring_products creada exitosamente');
}

async function createHelperFunction() {
    console.log('\n🔧 Creando función auxiliar para ejecutar SQL...');

    const { error } = await supabase.rpc('exec_sql', {
        sql: `
      -- Función para ejecutar SQL dinámico (si no existe)
      CREATE OR REPLACE FUNCTION public.exec_sql(sql TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
    });

    if (error && !error.message?.includes('already exists')) {
        console.log('⚠️  Función exec_sql ya existe o no se pudo crear');
        // No es crítico, continuamos
    } else {
        console.log('✅ Función auxiliar lista');
    }
}

async function main() {
    console.log('🚀 Iniciando corrección de tablas faltantes en Supabase...\n');
    console.log(`📍 URL: ${supabaseUrl}`);

    try {
        // Intentar crear la función auxiliar primero
        await createHelperFunction();

        // Crear tablas
        await createSupplierVisitsTable();
        await createExpiringProductsTable();

        console.log('\n✨ ¡Todas las tablas fueron creadas exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('  ✅ supplier_visits - Registra visitas de proveedores');
        console.log('  ✅ expiring_products - Gestiona productos próximos a caducar');
        console.log('\n💡 Próximo paso: Reiniciar la aplicación y verificar que no haya más errores 404');

    } catch (error) {
        console.error('\n❌ Error durante la ejecución:', error);
        console.log('\n💡 Solución alternativa: Ejecuta estos comandos SQL directamente en Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/editor');
        process.exit(1);
    }
}

main();
