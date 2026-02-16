-- ===============================================================
-- SOLUCIÓN SIMPLE: Insertar recomendaciones de reorden
-- ===============================================================

-- Paso 1: Agregar columnas faltantes (si no existen)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reorder_suggestions' AND column_name = 'estimated_cost') THEN
        ALTER TABLE public.reorder_suggestions ADD COLUMN estimated_cost DECIMAL(10, 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reorder_suggestions' AND column_name = 'supplier_name') THEN
        ALTER TABLE public.reorder_suggestions ADD COLUMN supplier_name VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reorder_suggestions' AND column_name = 'lead_time_days') THEN
        ALTER TABLE public.reorder_suggestions ADD COLUMN lead_time_days INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reorder_suggestions' AND column_name = 'ai_reasoning') THEN
        ALTER TABLE public.reorder_suggestions ADD COLUMN ai_reasoning TEXT;
    END IF;
END $$;

-- Paso 2: Limpiar sugerencias antiguas (opcional)
DELETE FROM public.reorder_suggestions 
WHERE status = 'pending' AND created_at < NOW() - INTERVAL '7 days';

-- Paso 3: Insertar datos demo manualmente
-- Primero necesitamos obtener IDs reales
WITH store_data AS (
  SELECT id as store_id FROM public.stores LIMIT 1
),
products_data AS (
  SELECT 
    id as product_id,
    ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM public.products
  LIMIT 3
)
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
  analysis_date,
  created_at,
  updated_at
)
SELECT
  p.product_id,
  s.store_id,
  CASE 
    WHEN p.rn = 1 THEN 5
    WHEN p.rn = 2 THEN 12
    ELSE 25
  END as current_stock,
  CASE 
    WHEN p.rn = 1 THEN 2.1
    WHEN p.rn = 2 THEN 1.5
    ELSE 0.8
  END as daily_sales_rate,
  CASE 
    WHEN p.rn = 1 THEN 2
    WHEN p.rn = 2 THEN 8
    ELSE 30
  END as days_until_depletion,
  CASE 
    WHEN p.rn = 1 THEN 24
    WHEN p.rn = 2 THEN 48
    ELSE 36
  END as suggested_quantity,
  CASE 
    WHEN p.rn = 1 THEN 0.95
    WHEN p.rn = 2 THEN 0.88
    ELSE 0.75
  END as confidence_score,
  CASE 
    WHEN p.rn = 1 THEN NOW() + INTERVAL '2 days'
    WHEN p.rn = 2 THEN NOW() + INTERVAL '8 days'
    ELSE NOW() + INTERVAL '30 days'
  END as estimated_depletion_date,
  CASE 
    WHEN p.rn = 1 THEN 360.00
    WHEN p.rn = 2 THEN 720.00
    ELSE 540.00
  END as estimated_cost,
  CASE 
    WHEN p.rn = 1 THEN 'Proveedor Principal'
    WHEN p.rn = 2 THEN 'Proveedor Secundario'
    ELSE 'Proveedor Principal'
  END as supplier_name,
  CASE 
    WHEN p.rn = 1 THEN 3
    WHEN p.rn = 2 THEN 5
    ELSE 3
  END as lead_time_days,
  'pending' as status,
  CASE 
    WHEN p.rn = 1 THEN 'urgent'::text
    WHEN p.rn = 2 THEN 'high'::text
    ELSE 'normal'::text
  END as priority,
  CASE 
    WHEN p.rn = 1 THEN 'Alta demanda detectada en los últimos 3 días. El stock actual se agotará antes del próximo reabastecimiento programado.'
    WHEN p.rn = 2 THEN 'Tendencia de crecimiento estacional identificada. Se recomienda aumentar inventario preventivo.'
    ELSE 'Nivel de inventario saludable, pero se aproxima reorden estándar en 4 semanas.'
  END as ai_reasoning,
  NOW() as analysis_date,
  NOW() as created_at,
  NOW() as updated_at
FROM products_data p
CROSS JOIN store_data s
WHERE s.store_id IS NOT NULL AND p.product_id IS NOT NULL;

-- Paso 4: Verificar las sugerencias insertadas
SELECT 
  r.id,
  p.name as producto,
  p.sku,
  r.current_stock as stock_actual,
  r.suggested_quantity as cantidad_sugerida,
  r.priority as prioridad,
  r.days_until_depletion as dias_restantes,
  r.ai_reasoning as razonamiento
FROM public.reorder_suggestions r
LEFT JOIN public.products p ON p.id = r.product_id
WHERE r.status = 'pending'
ORDER BY 
  CASE r.priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'normal' THEN 3
    WHEN 'low' THEN 4
  END ASC,
  r.days_until_depletion ASC;

-- ¡Si ves al menos 1 fila con datos, SUCCESS! ✅
