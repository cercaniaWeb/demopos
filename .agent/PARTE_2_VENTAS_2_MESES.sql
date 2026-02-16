-- ===============================================================
-- PARTE 2: VENTAS, INVENTARIO Y MOVIMIENTOS (2 MESES)
-- Este script genera datos realistas de operación de tienda
-- ===============================================================

-- EJECUTAR SOLO DESPUÉS DE POBLAR_BD_2_MESES.sql

BEGIN;

-- ===============================================================
-- CONFIGURAR INVENTARIO INICIAL
-- ===============================================================

WITH store_data AS (
  SELECT id as store_id FROM public.stores LIMIT 1
),
inventory_setup AS (
  INSERT INTO public.inventory (
    id,
    product_id,
    store_id,
    stock,
    reserved,
    min_stock,
    created_at,
    updated_at
  )
  SELECT 
    gen_random_uuid(),
    p.id,
    s.store_id,
    -- Stock inicial aleatorio pero realista según el tipo de producto
    CASE 
      WHEN p.price < 20 THEN FLOOR(RANDOM() * 80 + 40)::INTEGER  -- Productos baratos: 40-120 unidades
      WHEN p.price < 50 THEN FLOOR(RANDOM() * 50 + 20)::INTEGER  -- Precio medio: 20-70 unidades
      ELSE FLOOR(RANDOM() * 20 + 10)::INTEGER                    -- Productos caros: 10-30 unidades
    END,
    0, -- reserved
    p.min_stock,
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '60 days'
  FROM public.products p
  CROSS JOIN store_data s
  WHERE p.track_inventory = true
  RETURNING product_id, stock
)
SELECT COUNT(*) as inventarios_creados FROM inventory_setup;

-- ===============================================================
-- GENERAR VENTAS DÍA POR DÍA (60 DÍAS)
-- ===============================================================

-- Función auxiliar para generar ventas realistas
CREATE OR REPLACE FUNCTION generate_daily_sales(
  dias INTEGER DEFAULT 60,
  min_ventas_dia INTEGER DEFAULT 15,
  max_ventas_dia INTEGER DEFAULT 45
) RETURNS TABLE(ventas_generadas BIGINT) AS $$
DECLARE
  v_store_id UUID;
  v_day_offset INTEGER;
  v_num_sales INTEGER;
  v_sale_time TIMESTAMP;
  v_customer_id UUID;
  v_sale_id UUID;
  v_total_amount DECIMAL(10,2);
  v_num_items INTEGER;
  v_product_id UUID;
  v_quantity INTEGER;
  v_unit_price DECIMAL(10,2);
  v_subtotal DECIMAL(10,2);
  v_counter INTEGER := 0;
BEGIN
  -- Obtener el ID de la primera tienda
  SELECT id INTO v_store_id FROM public.stores LIMIT 1;
  
  -- Iterar por cada día (de más antiguo a más reciente)
  FOR v_day_offset IN 0..(dias - 1) LOOP
    -- Número aleatorio de ventas por día (más en fines de semana)
    v_num_sales := CASE 
      WHEN EXTRACT(DOW FROM NOW() - ((dias - v_day_offset) * INTERVAL '1 day')) IN (0, 6) THEN
        min_ventas_dia + FLOOR(RANDOM() * (max_ventas_dia - min_ventas_dia + 15))::INTEGER
      ELSE
        min_ventas_dia + FLOOR(RANDOM() * (max_ventas_dia - min_ventas_dia))::INTEGER
    END;
    
    -- Generar ventas para este día
    FOR i IN 1..v_num_sales LOOP
      -- Hora aleatoria del día (9 AM a 9 PM)
      v_sale_time := (NOW() - ((dias - v_day_offset) * INTERVAL '1 day'))::DATE 
                     + INTERVAL '9 hours' 
                     + (RANDOM() * INTERVAL '12 hours');
      
      -- Cliente aleatorio (70% clientes registrados, 30% público general)
      IF RANDOM() < 0.7 THEN
        SELECT id INTO v_customer_id FROM public.customers 
        WHERE name != 'Público General' 
        ORDER BY RANDOM() LIMIT 1;
      ELSE
        SELECT id INTO v_customer_id FROM public.customers 
        WHERE name = 'Público General' LIMIT 1;
      END IF;
      
      -- Crear venta
      v_sale_id := gen_random_uuid();
      v_total_amount := 0;
      
      -- Número de productos en la venta (1-8 productos)
      v_num_items := 1 + FLOOR(RANDOM() * 8)::INTEGER;
      
      -- Agregar productos a la venta
      FOR j IN 1..v_num_items LOOP
        -- Seleccionar producto aleatorio
        SELECT id, price INTO v_product_id, v_unit_price 
        FROM public.products 
        WHERE is_active = true 
        ORDER BY RANDOM() LIMIT 1;
        
        -- Cantidad (más probable 1-3, a veces más)
        v_quantity := CASE 
          WHEN RANDOM() < 0.7 THEN 1 + FLOOR(RANDOM() * 2)::INTEGER  -- 1-3
          WHEN RANDOM() < 0.9 THEN 3 + FLOOR(RANDOM() * 3)::INTEGER  -- 3-6
          ELSE 5 + FLOOR(RANDOM() * 5)::INTEGER                      -- 5-10
        END;
        
        v_subtotal := v_unit_price * v_quantity;
        v_total_amount := v_total_amount + v_subtotal;
        
        -- Insertar item de venta
        INSERT INTO public.sale_items (
          id, sale_id, product_id, quantity, unit_price, subtotal, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), v_sale_id, v_product_id, v_quantity, v_unit_price, v_subtotal, v_sale_time, v_sale_time
        );
        
        -- Restar del inventario
        UPDATE public.inventory 
        SET stock = stock - v_quantity,
            updated_at = v_sale_time
        WHERE product_id = v_product_id AND store_id = v_store_id;
        
      END LOOP;
      
      -- Insertar venta con total
      INSERT INTO public.sales (
        id, store_id, user_id, customer_id, total_amount, payment_method, 
        status, notes, created_at, updated_at
      ) VALUES (
        v_sale_id,
        v_store_id,
        (SELECT id FROM auth.users LIMIT 1), -- Usuario del sistema
        v_customer_id,
        v_total_amount,
        CASE 
          WHEN RANDOM() < 0.6 THEN 'cash'
          WHEN RANDOM() < 0.85 THEN 'card'
          ELSE 'transfer'
        END,
        'completed',
        NULL,
        v_sale_time,
        v_sale_time
      );
      
      v_counter := v_counter + 1;
      
    END LOOP;
  END LOOP;
  
  RETURN QUERY SELECT v_counter::BIGINT;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar generación de ventas
SELECT generate_daily_sales(60, 15, 45) as total_ventas_generadas;

-- Limpiar función temporal
DROP FUNCTION generate_daily_sales;

-- ===============================================================
-- REABASTECIMIENTOS PERIÓDICOS
-- ===============================================================

-- Simular reabastecimientos semanales
WITH store_data AS (
  SELECT id FROM public.stores LIMIT 1
),
restock_weeks AS (
  SELECT generate_series(0, 8) as week_num
),
restocks AS (
  INSERT INTO public.supplier_visits (
    id,
    store_id,
    supplier_name,
    visit_date,
    notes,
    total_amount,
    created_at,
    updated_at
  )
  SELECT 
    gen_random_uuid(),
    s.id,
    CASE (w.week_num % 3)
      WHEN 0 THEN 'Proveedor Principal'
      WHEN 1 THEN 'Proveedor Secundario'
      ELSE 'Distribuidora Regional'
    END,
    NOW() - ((8 - w.week_num) * INTERVAL '7 days'),
    'Reabastecimiento semanal programado',
    FLOOR(RANDOM() * 5000 + 3000)::DECIMAL(10,2),
    NOW() - ((8 - w.week_num) * INTERVAL '7 days'),
    NOW() - ((8 - w.week_num) * INTERVAL '7 days')
  FROM restock_weeks w
  CROSS JOIN store_data s
  RETURNING id
)
SELECT COUNT(*) as reabastecimientos_creados FROM restocks;

-- Actualizar inventario con reabastecimientos
UPDATE public.inventory i
SET stock = stock + (
  CASE 
    WHEN p.price < 20 THEN FLOOR(RANDOM() * 30 + 20)::INTEGER
    WHEN p.price < 50 THEN FLOOR(RANDOM() * 20 + 10)::INTEGER
    ELSE FLOOR(RANDOM() * 10 + 5)::INTEGER
  END
),
    updated_at = NOW() - INTERVAL '3 days'
FROM public.products p
WHERE i.product_id = p.id
  AND i.stock < p.min_stock + 5;

-- ===============================================================
-- PRODUCTOS PRÓXIMOS A VENCER
-- ===============================================================

WITH store_data AS (
  SELECT id FROM public.stores LIMIT 1
),
perishable_products AS (
  SELECT id FROM public.products 
  WHERE name ILIKE '%leche%' 
     OR name ILIKE '%huevo%'
     OR name ILIKE '%yogurt%'
     OR name ILIKE '%queso%'
     OR name ILIKE '%crema%'
     OR name ILIKE '%pan%'
     OR name ILIKE '%jamón%'
     OR name ILIKE '%salchicha%'
     OR name ILIKE '%tocino%'
  LIMIT 15
),
expiry_data AS (
  INSERT INTO public.expiring_products (
    id,
    product_id,
    store_id,
    batch_number,
    expiry_date,
    quantity,
    status,
    created_at,
    updated_at
  )
  SELECT 
    gen_random_uuid(),
    pp.id,
    s.id,
    'LOTE-' || LPAD((ROW_NUMBER() OVER())::TEXT, 6, '0'),
    CASE 
      WHEN ROW_NUMBER() OVER() % 3 = 0 THEN CURRENT_DATE + INTERVAL '2 days'   -- Urgente
      WHEN ROW_NUMBER() OVER() % 3 = 1 THEN CURRENT_DATE + INTERVAL '7 days'   -- Próximo
      ELSE CURRENT_DATE + INTERVAL '15 days'                                   -- Normal
    END,
    FLOOR(RANDOM() * 15 + 5)::INTEGER,
    CASE 
      WHEN ROW_NUMBER() OVER() % 3 = 0 THEN 'near_expiry'
      ELSE 'active'
    END,
    NOW() - INTERVAL '10 days',
    NOW()
  FROM perishable_products pp
  CROSS JOIN store_data s
  RETURNING id
)
SELECT COUNT(*) as productos_caducidad_registrados FROM expiry_data;

-- ===============================================================
-- ACTUALIZAR SUGERENCIAS DE REORDEN
-- ===============================================================

WITH store_data AS (
  SELECT id FROM public.stores LIMIT 1
),
low_stock_products AS (
  SELECT 
    i.product_id,
    i.store_id,
    i.stock as current_stock,
    p.min_stock,
    p.price,
    p.cost_price
  FROM public.inventory i
  JOIN public.products p ON p.id = i.product_id
  WHERE i.stock < (p.min_stock * 1.5)
  ORDER BY (i.stock::FLOAT / NULLIF(p.min_stock, 0)) ASC
  LIMIT 10
),
reorder_inserts AS (
  INSERT INTO public.reorder_suggestions (
    id,
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
    gen_random_uuid(),
    lsp.product_id,
    lsp.store_id,
    lsp.current_stock,
    ROUND((RANDOM() * 3 + 0.5)::NUMERIC, 2),  -- 0.5 - 3.5 unidades por día
    FLOOR(lsp.current_stock / GREATEST(RANDOM() * 2 + 0.5, 0.5))::INTEGER,
    (lsp.min_stock * 3)::INTEGER,
    ROUND((RANDOM() * 0.25 + 0.70)::NUMERIC, 2),  -- 0.70 - 0.95
    NOW() + (FLOOR(lsp.current_stock / GREATEST(RANDOM() * 2 + 0.5, 0.5)) * INTERVAL '1 day'),
    (lsp.cost_price * lsp.min_stock * 3),
    CASE (ROW_NUMBER() OVER() % 3)
      WHEN 0 THEN 'Proveedor Principal'
      WHEN 1 THEN 'Proveedor Secundario'
      ELSE 'Distribuidora Regional'
    END,
    FLOOR(RANDOM() * 5 + 2)::INTEGER,  -- 2-7 días
    'pending',
    CASE 
      WHEN lsp.current_stock < lsp.min_stock THEN 'urgent'
      WHEN lsp.current_stock < (lsp.min_stock * 1.2) THEN 'high'
      ELSE 'normal'
    END,
    CASE 
      WHEN lsp.current_stock < lsp.min_stock THEN 'Stock crítico. Requiere reorden inmediato para evitar desabasto.'
      WHEN lsp.current_stock < (lsp.min_stock * 1.2) THEN 'Nivel de inventario bajo pero controlado. Programar reorden en breve.'
      ELSE 'Stock saludable. Reorden preventivo recomendado según tendencia de ventas.'
    END,
    NOW(),
    NOW(),
    NOW()
  FROM low_stock_products lsp
  RETURNING id
)
SELECT COUNT(*) as sugerencias_reorden_actualizadas FROM reorder_inserts;

COMMIT;

-- ===============================================================
-- VERIFICACIÓN FINAL
-- ===============================================================

SELECT 
  'INVENTARIO' as tabla,
  COUNT(*) as registros,
  SUM(stock) as stock_total
FROM public.inventory
UNION ALL
SELECT 
  'VENTAS' as tabla,
  COUNT(*) as registros,
  ROUND(SUM(total_amount)::NUMERIC, 2) as stock_total
FROM public.sales
UNION ALL
SELECT 
  'ITEMS VENDIDOS' as tabla,
  COUNT(*) as registros,
  SUM(quantity) as stock_total
FROM public.sale_items
UNION ALL
SELECT 
  'REABASTECIMIENTOS' as tabla,
  COUNT(*) as registros,
  ROUND(SUM(total_amount)::NUMERIC, 2) as stock_total
FROM public.supplier_visits
UNION ALL
SELECT 
  'PRODUCTOS CADUCIDAD' as tabla,
  COUNT(*) as registros,
  SUM(quantity) as stock_total
FROM public.expiring_products
UNION ALL
SELECT 
  'SUGERENCIAS REORDEN' as tabla,
  COUNT(*) as registros,
  SUM(suggested_quantity) as stock_total
FROM public.reorder_suggestions;

-- ===============================================================
-- ESTADÍSTICAS RÁPIDAS
-- ===============================================================

-- Ventas por día (últimos 7 días)
SELECT 
  DATE(created_at) as fecha,
  COUNT(*) as num_ventas,
  ROUND(SUM(total_amount)::NUMERIC, 2) as total_vendido
FROM public.sales
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- ✅ ¡BASE DE DATOS POBLADA CON 2 MESES DE OPERACIÓN!
