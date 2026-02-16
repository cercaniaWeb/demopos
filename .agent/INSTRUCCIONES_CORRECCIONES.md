# 🔧 Instrucciones para Aplicar Correcciones a AURA POS

## ⚠️ IMPORTANTE: Node.js v10 no es compatible

Dado que estás usando Node.js v10.24.1 y Next.js 14 requiere v16+, necesitarás aplicar las correcciones manualmente en Supabase Dashboard.

---

## 1️⃣ Crear Tablas Faltantes en Supabase (CRÍTICO)

### Pasos:

1. **Ir a Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/oidnjqugqqfqwqdluufc
   - Navega a: **SQL Editor** (en el menú lateral)

2. **Ejecutar el siguiente SQL:**

```sql
-- =================================================================
-- PASO 1: Crear tabla supplier_visits
-- =================================================================

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

-- Índices
CREATE INDEX IF NOT EXISTS idx_supplier_visits_store_id 
  ON public.supplier_visits(store_id);
CREATE INDEX IF NOT EXISTS idx_supplier_visits_visit_date 
  ON public.supplier_visits(visit_date DESC);

-- Habilitar RLS
ALTER TABLE public.supplier_visits ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view supplier visits from their store"
  ON public.supplier_visits FOR SELECT
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert supplier visits to their store"
  ON public.supplier_visits FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

-- =================================================================
-- PASO 2: Crear tabla expiring_products
-- =================================================================

CREATE TABLE IF NOT EXISTS public.expiring_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  batch_number VARCHAR(100),
  expiry_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  cost_price DECIMAL(10, 2),
  selling_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'active' 
    CHECK (status IN ('active', 'near_expiry', 'expired', 'disposed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, store_id, batch_number, expiry_date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_expiring_products_product_id 
  ON public.expiring_products(product_id);
CREATE INDEX IF NOT EXISTS idx_expiring_products_store_id 
  ON public.expiring_products(store_id);
CREATE INDEX IF NOT EXISTS idx_expiring_products_expiry_date 
  ON public.expiring_products(expiry_date);

-- Habilitar RLS
ALTER TABLE public.expiring_products ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view expiring products from their store"
  ON public.expiring_products FOR SELECT
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert expiring products to their store"
  ON public.expiring_products FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

-- =================================================================
-- PASO 3: Verificar que se crearon correctamente
-- =================================================================

SELECT 
  tablename as tabla,
  schemaname as esquema
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('supplier_visits', 'expiring_products');

-- Deberías ver ambas tablas listadas
```

3. **Hacer clic en "Run" (▶️)**
4. **Verificar que aparezca:**
   ```
   ✓ Success
   2 rows returned
   ```

---

## 2️⃣ Verificar Configuración de Storage (Imágenes)

### Pasos:

1. **Ir a:** **Storage** → **Buckets**
2. **Buscar un bucket llamado:** `product-images` o similar
3. **Si NO existe, créalo:**
   - Nombre: `product-images`
   - Público: ✅ Sí
4. **Configurar política de acceso público:**

```sql
-- En SQL Editor, ejecuta:
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );
```

---

## 3️⃣ Actualizar Aplicación en Local (Una vez actualizado Node.js)

### Opción A: Usar NVM (Recomendado)

```bash
# Instalar NVM (si no lo tienes)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Instalar Node.js 18
nvm install 18
nvm use 18

# Verificar
node --version  # Debería mostrar v18.x.x

# Instalar dependencias y correr
cd /home/lrs/demopos
npm install
npm run dev
```

### Opción B: Actualizar Node.js directamente

```bash
# En Arch/Manjaro
sudo pacman -S nodejs npm

# Verificar
node --version
```

---

## 4️⃣ Deploy a Producción

Una vez que hayas aplicado las correcciones de SQL en Supabase:

```bash
# Hacer commit de los cambios de código
git add .
git commit -m "fix: mejora responsividad móvil y crea tablas faltantes"
git push origin main

# Vercel desplegará automáticamente
```

---

## 5️⃣ Verificar Correcciones

### Checklist de Verificación:

- [ ] **Tablas creadas en Supabase**
  - Verificar en Dashboard > Database > Tables
  - Deberías ver: `supplier_visits` y `expiring_products`

- [ ] **No más errores 404 en consola**
  - Abrir https://aura-pos-fawn.vercel.app/
  - Abrir DevTools (F12) → Console
  - No debería haber errores de "Could not find table"

- [ ] **Vista móvil mejorada**
  - Abrir en móvil o con DevTools (375px)
  - El inventario ahora muestra tarjetas en lugar de tabla
  - Los botones se apilan verticalmente

- [ ] **Imágenes funcionando**
  - Los productos deberían mostrar imágenes en lugar de "NO IMG"

---

## 📊 Resumen de Archivos Modificados/Creados

### ✅ Nuevos Componentes:
- `/src/components/molecules/InventoryCard.tsx` - Card responsivo para móvil
- `/src/hooks/useResponsive.ts` - Hook para detectar breakpoints

### ✏️ Archivos Modificados:
- `/src/app/(dashboard)/inventory/page.tsx` - Vista adaptativa móvil/desktop

### 📄 Migraciones:
- `/supabase/migrations/20260216_create_missing_tables.sql` - SQL completo
- `/scripts/apply-migration.js` - Script Node.js (requiere v16+)

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
**Solución:** Las tablas no se crearon. Ve a Supabase Dashboard y ejecuta el SQL manualmente.

### Error: Node.js version
**Solución:** Actualiza Node.js a v18 usando NVM.

### Las imágenes siguen sin aparecer
**Solución:** 
1. Verifica que el bucket existe en Storage
2. Verifica las políticas de acceso público
3. Actualiza las URLs en la tabla `products`

---

## 📞 Siguiente Paso Inmediato

1. 🔴 **URGENTE:** Ejecuta el SQL en Supabase Dashboard (Paso 1)
2. 🟡 **IMPORTANTE:** Verifica que no haya más errores 404 en producción
3. 🟢 **OPCIONAL:** Actualiza Node.js para desarrollo local

---

**Fecha:** 2026-02-16  
**Generado automáticamente por:** Antigravity Agent
