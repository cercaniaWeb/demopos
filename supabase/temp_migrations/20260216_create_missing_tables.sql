-- Migración: Crear tablas faltantes supplier_visits y expiring_products
-- Fecha: 2026-02-16
-- Descripción: Corrige los errores 404 identificados en el scan de producción

-- ==================================================
-- TABLA: supplier_visits
-- Propósito: Registrar visitas de proveedores a las tiendas
-- ==================================================

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
CREATE INDEX IF NOT EXISTS idx_supplier_visits_store_id 
  ON public.supplier_visits(store_id);

CREATE INDEX IF NOT EXISTS idx_supplier_visits_visit_date 
  ON public.supplier_visits(visit_date DESC);

CREATE INDEX IF NOT EXISTS idx_supplier_visits_created_by 
  ON public.supplier_visits(created_by);

-- Comentarios
COMMENT ON TABLE public.supplier_visits IS 'Registro de visitas de proveedores a las tiendas';
COMMENT ON COLUMN public.supplier_visits.products_delivered IS 'Array JSON de productos entregados con formato: [{product_id, quantity, price}]';

-- ==================================================
-- TABLA: expiring_products
-- Propósito: Gestionar productos próximos a caducar
-- ==================================================

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
  
  -- Constraint único para evitar duplicados de lotes
  UNIQUE(product_id, store_id, batch_number, expiry_date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_expiring_products_product_id 
  ON public.expiring_products(product_id);

CREATE INDEX IF NOT EXISTS idx_expiring_products_store_id 
  ON public.expiring_products(store_id);

CREATE INDEX IF NOT EXISTS idx_expiring_products_expiry_date 
  ON public.expiring_products(expiry_date);

CREATE INDEX IF NOT EXISTS idx_expiring_products_status 
  ON public.expiring_products(status);

-- Índice compuesto para búsquedas de productos próximos a caducar
CREATE INDEX IF NOT EXISTS idx_expiring_products_near_expiry 
  ON public.expiring_products(store_id, expiry_date, status) 
  WHERE status = 'active';

-- Comentarios
COMMENT ON TABLE public.expiring_products IS 'Productos próximos a caducar organizados por lote';
COMMENT ON COLUMN public.expiring_products.status IS 'Estados: active (normal), near_expiry (dentro de 30 días), expired (caducado), disposed (eliminado)';

-- ==================================================
-- ROW LEVEL SECURITY (RLS)
-- ==================================================

-- Habilitar RLS en ambas tablas
ALTER TABLE public.supplier_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expiring_products ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- POLÍTICAS RLS: supplier_visits
-- ==================================================

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Users can view supplier visits from their store" ON public.supplier_visits;
DROP POLICY IF EXISTS "Users can insert supplier visits to their store" ON public.supplier_visits;
DROP POLICY IF EXISTS "Users can update supplier visits from their store" ON public.supplier_visits;
DROP POLICY IF EXISTS "Users can delete supplier visits from their store" ON public.supplier_visits;

-- Crear políticas nuevas
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

CREATE POLICY "Users can update supplier visits from their store"
  ON public.supplier_visits FOR UPDATE
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete supplier visits from their store"
  ON public.supplier_visits FOR DELETE
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

-- ==================================================
-- POLÍTICAS RLS: expiring_products
-- ==================================================

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Users can view expiring products from their store" ON public.expiring_products;
DROP POLICY IF EXISTS "Users can insert expiring products to their store" ON public.expiring_products;
DROP POLICY IF EXISTS "Users can update expiring products from their store" ON public.expiring_products;
DROP POLICY IF EXISTS "Users can delete expiring products from their store" ON public.expiring_products;

-- Crear políticas nuevas
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

CREATE POLICY "Users can update expiring products from their store"
  ON public.expiring_products FOR UPDATE
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete expiring products from their store"
  ON public.expiring_products FOR DELETE
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

-- ==================================================
-- TRIGGERS
-- ==================================================

-- Trigger para actualizar updated_at automáticamente en supplier_visits
CREATE OR REPLACE FUNCTION public.update_supplier_visits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_supplier_visits_updated_at ON public.supplier_visits;
CREATE TRIGGER trigger_update_supplier_visits_updated_at
  BEFORE UPDATE ON public.supplier_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_supplier_visits_updated_at();

-- Trigger para actualizar updated_at automáticamente en expiring_products
CREATE OR REPLACE FUNCTION public.update_expiring_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_expiring_products_updated_at ON public.expiring_products;
CREATE TRIGGER trigger_update_expiring_products_updated_at
  BEFORE UPDATE ON public.expiring_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_expiring_products_updated_at();

-- Trigger para actualizar automáticamente el status basado en la fecha de caducidad
CREATE OR REPLACE FUNCTION public.update_expiring_product_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la fecha de caducidad es hoy o pasada, marcar como expired
  IF NEW.expiry_date <= CURRENT_DATE THEN
    NEW.status = 'expired';
  -- Si la fecha de caducidad está dentro de 30 días, marcar como near_expiry
  ELSIF NEW.expiry_date <= (CURRENT_DATE + INTERVAL '30 days') THEN
    NEW.status = 'near_expiry';
  -- Si no, mantener como active
  ELSE
    NEW.status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_expiring_product_status ON public.expiring_products;
CREATE TRIGGER trigger_update_expiring_product_status
  BEFORE INSERT OR UPDATE OF expiry_date ON public.expiring_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_expiring_product_status();

-- ==================================================
-- FUNCIONES ÚTILES
-- ==================================================

-- Función para obtener productos próximos a caducar (dentro de X días)
CREATE OR REPLACE FUNCTION public.get_near_expiry_products(
  p_store_id UUID,
  p_days_threshold INTEGER DEFAULT 30
)
RETURNS TABLE (
  product_id UUID,
  product_name VARCHAR,
  batch_number VARCHAR,
  expiry_date DATE,
  days_until_expiry INTEGER,
  quantity INTEGER,
  selling_price DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ep.product_id,
    p.name AS product_name,
    ep.batch_number,
    ep.expiry_date,
    (ep.expiry_date - CURRENT_DATE) AS days_until_expiry,
    ep.quantity,
    ep.selling_price
  FROM public.expiring_products ep
  INNER JOIN public.products p ON p.id = ep.product_id
  WHERE ep.store_id = p_store_id
    AND ep.status IN ('active', 'near_expiry')
    AND ep.expiry_date <= (CURRENT_DATE + (p_days_threshold || ' days')::INTERVAL)
    AND ep.expiry_date >= CURRENT_DATE
  ORDER BY ep.expiry_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de productos caducados
CREATE OR REPLACE FUNCTION public.get_expiry_stats(
  p_store_id UUID
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_near_expiry', (
      SELECT COUNT(*) FROM public.expiring_products
      WHERE store_id = p_store_id AND status = 'near_expiry'
    ),
    'total_expired', (
      SELECT COUNT(*) FROM public.expiring_products
      WHERE store_id = p_store_id AND status = 'expired'
    ),
    'total_value_at_risk', (
      SELECT COALESCE(SUM(quantity * selling_price), 0)
      FROM public.expiring_products
      WHERE store_id = p_store_id AND status = 'near_expiry'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- DATOS DE EJEMPLO (Opcional - comentado)
-- ==================================================

/*
-- Ejemplo de inserción de producto próximo a caducar
INSERT INTO public.expiring_products (
  product_id,
  store_id,
  batch_number,
  expiry_date,
  quantity,
  cost_price,
  selling_price
) VALUES (
  (SELECT id FROM public.products LIMIT 1),
  (SELECT id FROM public.stores LIMIT 1),
  'BATCH-2026-001',
  CURRENT_DATE + INTERVAL '15 days',
  50,
  10.50,
  15.00
);
*/

-- ==================================================
-- VERIFICACIÓN
-- ==================================================

-- Verificar que las tablas fueron creadas correctamente
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'supplier_visits') THEN
    RAISE EXCEPTION 'ERROR: La tabla supplier_visits no fue creada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'expiring_products') THEN
    RAISE EXCEPTION 'ERROR: La tabla expiring_products no fue creada';
  END IF;
  
  RAISE NOTICE '✅ Migración completada exitosamente';
  RAISE NOTICE '✅ Tablas creadas: supplier_visits, expiring_products';
  RAISE NOTICE '✅ Políticas RLS configuradas';
  RAISE NOTICE '✅ Triggers y funciones creados';
END $$;
