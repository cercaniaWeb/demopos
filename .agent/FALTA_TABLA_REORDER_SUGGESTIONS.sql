-- ===============================================================
-- TABLA REORDER_SUGGESTIONS - Para Recomendaciones de Reorden
-- ===============================================================
-- EJECUTA ESTE SQL EN SUPABASE DASHBOARD > SQL EDITOR
-- ===============================================================

CREATE TABLE IF NOT EXISTS public.reorder_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  
  -- Datos de análisis
  current_stock INTEGER NOT NULL DEFAULT 0,
  daily_sales_rate DECIMAL(10, 2) DEFAULT 0,
  days_until_depletion INTEGER DEFAULT 0,
  suggested_quantity INTEGER NOT NULL DEFAULT 0,
  confidence_score DECIMAL(3, 2) DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Fechas y costos
  estimated_depletion_date TIMESTAMP WITH TIME ZONE,
  estimated_cost DECIMAL(10, 2),
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Proveedor info
  supplier_name VARCHAR(255),
  lead_time_days INTEGER DEFAULT 0,
  
  -- Estado y prioridad
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'dismissed', 'expired')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  
  -- IA reasoning
  ai_reasoning TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint único para evitar duplicados
  UNIQUE(product_id, store_id, analysis_date)
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_reorder_suggestions_product_id 
  ON public.reorder_suggestions(product_id);

CREATE INDEX IF NOT EXISTS idx_reorder_suggestions_store_id 
  ON public.reorder_suggestions(store_id);

CREATE INDEX IF NOT EXISTS idx_reorder_suggestions_status 
  ON public.reorder_suggestions(status);

CREATE INDEX IF NOT EXISTS idx_reorder_suggestions_priority 
  ON public.reorder_suggestions(priority);

-- Índice compuesto para queries del dashboard
CREATE INDEX IF NOT EXISTS idx_reorder_suggestions_pending 
  ON public.reorder_suggestions(store_id, status, priority, days_until_depletion) 
  WHERE status = 'pending';

-- Habilitar RLS
ALTER TABLE public.reorder_suggestions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
DROP POLICY IF EXISTS "Users can view reorder suggestions from their store" ON public.reorder_suggestions;
DROP POLICY IF EXISTS "Users can insert reorder suggestions to their store" ON public.reorder_suggestions;
DROP POLICY IF EXISTS "Users can update reorder suggestions from their store" ON public.reorder_suggestions;
DROP POLICY IF EXISTS "Users can delete reorder suggestions from their store" ON public.reorder_suggestions;

CREATE POLICY "Users can view reorder suggestions from their store"
  ON public.reorder_suggestions FOR SELECT
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reorder suggestions to their store"
  ON public.reorder_suggestions FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update reorder suggestions from their store"
  ON public.reorder_suggestions FOR UPDATE
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete reorder suggestions from their store"
  ON public.reorder_suggestions FOR DELETE
  USING (
    store_id IN (
      SELECT store_id FROM public.user_stores 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_reorder_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_reorder_suggestions_updated_at ON public.reorder_suggestions;
CREATE TRIGGER trigger_update_reorder_suggestions_updated_at
  BEFORE UPDATE ON public.reorder_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reorder_suggestions_updated_at();

-- Trigger para marcar como expired sugerencias antiguas
CREATE OR REPLACE FUNCTION public.expire_old_reorder_suggestions()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el producto ya tiene sugerencias pendientes antiguas (>7 días), marcarlas como expired
  UPDATE public.reorder_suggestions
  SET status = 'expired'
  WHERE product_id = NEW.product_id
    AND store_id = NEW.store_id
    AND status = 'pending'
    AND analysis_date < NOW() - INTERVAL '7 days'
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_expire_old_reorder_suggestions ON public.reorder_suggestions;
CREATE TRIGGER trigger_expire_old_reorder_suggestions
  AFTER INSERT ON public.reorder_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.expire_old_reorder_suggestions();

-- ===============================================================
-- INSERTAR DATOS DEMO (para pruebas)
-- ===============================================================

-- Primero, obtener IDs de productos y tiendas
DO $$
DECLARE
  v_store_id UUID;
  v_product_1_id UUID;
  v_product_2_id UUID;
  v_product_3_id UUID;
BEGIN
  -- Obtener ID de la primera tienda
  SELECT id INTO v_store_id FROM public.stores LIMIT 1;
  
  -- Obtener IDs de algunos productos
  SELECT id INTO v_product_1_id FROM public.products ORDER BY RANDOM() LIMIT 1 OFFSET 0;
  SELECT id INTO v_product_2_id FROM public.products ORDER BY RANDOM() LIMIT 1 OFFSET 1;
  SELECT id INTO v_product_3_id FROM public.products ORDER BY RANDOM() LIMIT 1 OFFSET 2;
  
  -- Solo insertar si tenemos datos
  IF v_store_id IS NOT NULL AND v_product_1_id IS NOT NULL THEN
    -- Sugerencia URGENTE
    INSERT INTO public.reorder_suggestions (
      product_id,
      store_id,
      current_stock,
      daily_sales_rate,
      days_until_depletion,
      suggested_quantity,
      confidence_score,
      estimated_depletion_date,
      estimated_cost,
      supplier_name,
      lead_time_days,
      status,
      priority,
      ai_reasoning,
      analysis_date
    ) VALUES (
      v_product_1_id,
      v_store_id,
      5,
      2.1,
      2,
      24,
      0.95,
      NOW() + INTERVAL '2 days',
      360.00,
      'Proveedor Principal',
      3,
      'pending',
      'urgent',
      'Alta demanda detectada en los últimos 3 días. El stock actual se agotará antes del próximo reabastecimiento programado.',
      NOW()
    ) ON CONFLICT (product_id, store_id, analysis_date) DO NOTHING;
    
    -- Sugerencia HIGH
    IF v_product_2_id IS NOT NULL THEN
      INSERT INTO public.reorder_suggestions (
        product_id,
        store_id,
        current_stock,
        daily_sales_rate,
        days_until_depletion,
        suggested_quantity,
        confidence_score,
        estimated_depletion_date,
        estimated_cost,
        supplier_name,
        lead_time_days,
        status,
        priority,
        ai_reasoning,
        analysis_date
      ) VALUES (
        v_product_2_id,
        v_store_id,
        12,
        1.5,
        8,
        48,
        0.88,
        NOW() + INTERVAL '8 days',
        720.00,
        'Proveedor Secundario',
        5,
        'pending',
        'high',
        'Tendencia de crecimiento estacional identificada. Se recomienda aumentar inventario preventivo.',
        NOW()
      ) ON CONFLICT (product_id, store_id, analysis_date) DO NOTHING;
    END IF;
    
    -- Sugerencia NORMAL
    IF v_product_3_id IS NOT NULL THEN
      INSERT INTO public.reorder_suggestions (
        product_id,
        store_id,
        current_stock,
        daily_sales_rate,
        days_until_depletion,
        suggested_quantity,
        confidence_score,
        estimated_depletion_date,
        estimated_cost,
        supplier_name,
        lead_time_days,
        status,
        priority,
        ai_reasoning,
        analysis_date
      ) VALUES (
        v_product_3_id,
        v_store_id,
        25,
        0.8,
        30,
        36,
        0.75,
        NOW() + INTERVAL '30 days',
        540.00,
        'Proveedor Principal',
        3,
        'pending',
        'normal',
        'Nivel de inventario saludable, pero se aproxima reorden estándar en 4 semanas.',
        NOW()
      ) ON CONFLICT (product_id, store_id, analysis_date) DO NOTHING;
    END IF;
    
    RAISE NOTICE '✅ Datos demo insertados exitosamente';
  ELSE
    RAISE NOTICE '⚠️  No se encontraron productos o tiendas para insertar datos demo';
  END IF;
END $$;

-- ===============================================================
-- VERIFICACIÓN
-- ===============================================================

SELECT 
  'reorder_suggestions' as tabla_creada,
  COUNT(*) as num_columnas
FROM information_schema.columns 
WHERE table_name = 'reorder_suggestions' AND table_schema = 'public';

-- Ver sugerencias creadas
SELECT 
  id,
  product_id,
  current_stock,
  suggested_quantity,
  priority,
  status,
  days_until_depletion
FROM public.reorder_suggestions
ORDER BY priority DESC, days_until_depletion ASC
LIMIT 5;

-- ¡Si ves las sugerencias listadas, SUCCESS! ✅
