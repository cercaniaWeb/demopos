-- ===============================================================
-- FIX: Agregar columnas faltantes a reorder_suggestions
-- ===============================================================

-- Paso 1: Agregar columnas faltantes si no existen
DO $$ 
BEGIN
    -- estimated_cost
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reorder_suggestions' 
        AND column_name = 'estimated_cost'
    ) THEN
        ALTER TABLE public.reorder_suggestions 
        ADD COLUMN estimated_cost DECIMAL(10, 2);
    END IF;

    -- supplier_name
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reorder_suggestions' 
        AND column_name = 'supplier_name'
    ) THEN
        ALTER TABLE public.reorder_suggestions 
        ADD COLUMN supplier_name VARCHAR(255);
    END IF;

    -- lead_time_days
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reorder_suggestions' 
        AND column_name = 'lead_time_days'
    ) THEN
        ALTER TABLE public.reorder_suggestions 
        ADD COLUMN lead_time_days INTEGER DEFAULT 0;
    END IF;

    -- ai_reasoning
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reorder_suggestions' 
        AND column_name = 'ai_reasoning'
    ) THEN
        ALTER TABLE public.reorder_suggestions 
        ADD COLUMN ai_reasoning TEXT;
    END IF;

    RAISE NOTICE '✅ Columnas agregadas/verificadas exitosamente';
END $$;

-- Paso 2: Verificar estructura actual
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'reorder_suggestions'
ORDER BY ordinal_position;

-- Paso 3: Insertar datos demo
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
  SELECT id INTO v_product_1_id FROM public.products ORDER BY created_at DESC LIMIT 1 OFFSET 0;
  SELECT id INTO v_product_2_id FROM public.products ORDER BY created_at DESC LIMIT 1 OFFSET 1;
  SELECT id INTO v_product_3_id FROM public.products ORDER BY created_at DESC LIMIT 1 OFFSET 2;
  
  -- Solo insertar si tenemos datos
  IF v_store_id IS NOT NULL AND v_product_1_id IS NOT NULL THEN
    -- Primero, limpiar sugerencias viejas
    DELETE FROM public.reorder_suggestions 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
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
    ) ON CONFLICT (product_id, store_id, analysis_date) 
    DO UPDATE SET
      current_stock = EXCLUDED.current_stock,
      suggested_quantity = EXCLUDED.suggested_quantity,
      priority = EXCLUDED.priority;
    
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
      ) ON CONFLICT (product_id, store_id, analysis_date) 
      DO UPDATE SET
        current_stock = EXCLUDED.current_stock,
        suggested_quantity = EXCLUDED.suggested_quantity,
        priority = EXCLUDED.priority;
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
      ) ON CONFLICT (product_id, store_id, analysis_date) 
      DO UPDATE SET
        current_stock = EXCLUDED.current_stock,
        suggested_quantity = EXCLUDED.suggested_quantity,
        priority = EXCLUDED.priority;
    END IF;
    
    RAISE NOTICE '✅ Datos demo insertados exitosamente';
  ELSE
    RAISE NOTICE '⚠️  No se encontraron productos o tiendas para insertar datos demo';
  END IF;
END $$;

-- Paso 4: Ver sugerencias creadas
SELECT 
  r.id,
  p.name as producto,
  r.current_stock,
  r.suggested_quantity,
  r.priority,
  r.status,
  r.days_until_depletion,
  r.ai_reasoning
FROM public.reorder_suggestions r
LEFT JOIN public.products p ON p.id = r.product_id
WHERE r.status = 'pending'
ORDER BY 
  CASE r.priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'normal' THEN 3
    WHEN 'low' THEN 4
  END,
  r.days_until_depletion ASC
LIMIT 10;

-- ¡Si ves las sugerencias con nombres de productos, SUCCESS! ✅
