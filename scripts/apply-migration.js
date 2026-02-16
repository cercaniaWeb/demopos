/**
 * Script para aplicar la migración SQL a Supabase
 * Ejecutar con: node scripts/apply-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan credenciales de Supabase en .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function main() {
    console.log('🚀 Aplicando migración de tablas faltantes...\n');
    console.log(`📍 URL: ${supabaseUrl}`);

    // Leer el archivo SQL
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260216_create_missing_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Ejecutando SQL desde:', migrationPath);

    // Dividir el SQL en bloques ejecutables
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';

        // Saltar comentarios
        if (statement.includes('COMMENT ON') || statement.includes('RAISE NOTICE')) {
            continue;
        }

        try {
            const { error } = await supabase.rpc('exec_sql', { sql: statement });

            if (error) {
                // Ignorar errores de "ya existe"
                if (error.message.includes('already exists') ||
                    error.message.includes('ya existe') ||
                    error.message.includes('duplicate')) {
                    console.log(`⚠️  Objeto ya existe (${i + 1}/${statements.length})`);
                } else {
                    console.error(`❌ Error en statement ${i + 1}:`, error.message);
                    errorCount++;
                }
            } else {
                successCount++;
                console.log(`✅ Statement ${i + 1}/${statements.length} ejecutado`);
            }
        } catch (err) {
            console.error(`❌ Error ejecutando statement ${i + 1}:`, err.message);
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Migración completada`);
    console.log(`   Exitosos: ${successCount}`);
    console.log(`   Errores: ${errorCount}`);
    console.log('='.repeat(50));
}

main().catch(console.error);
