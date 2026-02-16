-- ===============================================================
-- CORRECCIONES CRÍTICAS - Errores Encontrados en QA Testing
-- ===============================================================

-- PROBLEMA 1: Falta columna "status" en supplier_visits
ALTER TABLE public.supplier_visits 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' 
CHECK (status IN ('pending', 'completed', 'cancelled'));

-- PROBLEMA 2: Falta columna "days_until_expiry" en expiring_products
ALTER TABLE public.expiring_products 
ADD COLUMN IF NOT EXISTS days_until_expiry INTEGER 
GENERATED ALWAYS AS (
  CASE 
    WHEN expiry_date >= CURRENT_DATE THEN (expiry_date - CURRENT_DATE)
    ELSE 0
  END
) STORED;

-- PROBLEMA 3: Verificar políticas RLS en tabla sales
-- Esto podría estar bloqueando la inserción de ventas desde el POS

-- Ver políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'sales';

-- Si no hay política de INSERT, crearla
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sales' AND cmd = 'INSERT'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert sales to their store"
      ON public.sales FOR INSERT
      WITH CHECK (
        store_id IN (
          SELECT store_id FROM public.user_stores 
          WHERE user_id = auth.uid()
        )
      )';
  END IF;
END $$;

-- PROBLEMA 4: Asegurar que RLS está habilitado
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- PROBLEMA 5: Verificar si hay clientes en la BD
SELECT COUNT(*) as total_clientes FROM public.customers;

-- Si no hay clientes, podría ser que la relación user_stores no esté configurada
-- Verificar relación store del usuario demo
SELECT 
  u.id as user_id,
  u.email,
  us.store_id,
  s.name as store_name
FROM auth.users u
LEFT JOIN public.user_stores us ON us.user_id = u.id
LEFT JOIN public.stores s ON s.id = us.store_id
LIMIT 5;

-- ===============================================================
-- VERIFICACIÓN FINAL
-- ===============================================================

-- Ver si las columnas se agregaron correctamente
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('supplier_visits', 'expiring_products', 'sales')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ✅ Si ves las nuevas columnas, las correcciones se aplicaron!
