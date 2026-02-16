-- ===============================================================
-- SQL RÁPIDO PARA EJECUTAR EN SUPABASE DASHBOARD
-- ===============================================================
-- INSTRUCCIONES:
-- 1. Ve a: https://supabase.com/dashboard/project/oidnjqugqqfqwqdluufc/sql
-- 2. Copia COMPLETO este archivo
-- 3. Pégalo en el editor SQL
-- 4. Presiona "Run" (botón verde)
-- 5. Espera confirmación "Success"
-- ===============================================================

-- TABLA 1: supplier_visits
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

CREATE INDEX IF NOT EXISTS idx_supplier_visits_store_id ON public.supplier_visits(store_id);
CREATE INDEX IF NOT EXISTS idx_supplier_visits_visit_date ON public.supplier_visits(visit_date DESC);

ALTER TABLE public.supplier_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view supplier visits from their store"
  ON public.supplier_visits FOR SELECT
  USING (store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert supplier visits to their store"
  ON public.supplier_visits FOR INSERT
  WITH CHECK (store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()));

-- TABLA 2: expiring_products
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

CREATE INDEX IF NOT EXISTS idx_expiring_products_product_id ON public.expiring_products(product_id);
CREATE INDEX IF NOT EXISTS idx_expiring_products_store_id ON public.expiring_products(store_id);
CREATE INDEX IF NOT EXISTS idx_expiring_products_expiry_date ON public.expiring_products(expiry_date);

ALTER TABLE public.expiring_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view expiring products from their store"
  ON public.expiring_products FOR SELECT
  USING (store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert expiring products to their store"
  ON public.expiring_products FOR INSERT
  WITH CHECK (store_id IN (SELECT store_id FROM public.user_stores WHERE user_id = auth.uid()));

-- VERIFICACIÓN
SELECT 
  'supplier_visits' as tabla_creada,
  COUNT(*) as num_columnas
FROM information_schema.columns 
WHERE table_name = 'supplier_visits' AND table_schema = 'public'
UNION ALL
SELECT 
  'expiring_products' as tabla_creada,
  COUNT(*) as num_columnas
FROM information_schema.columns 
WHERE table_name = 'expiring_products' AND table_schema = 'public';

-- Si ves 2 filas con números positivos, ¡SUCCESS! ✅
