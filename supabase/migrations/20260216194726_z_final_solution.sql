ALTER TABLE public.products ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
-- ===============================================================
-- 🚀 SCRIPT MAESTRO: REPARACIÓN TOTAL Y POBLACIÓN DE 2 MESES
-- ===============================================================
-- Este script realiza tres tareas críticas:
-- 1. Estandariza el esquema (agrega todas las columnas faltantes)
-- 2. Crea los productos y categorías (75 items de abarrotes)
-- 3. Genera historial de 2 meses de ventas y movimientos
-- ===============================================================

BEGIN;

-- ===============================================================
-- FASE 1: SANACIÓN DE ESQUEMA (AGREGAR COLUMNAS FALTANTES)
-- ===============================================================
DO $$ 
DECLARE
    t text;
BEGIN
    -- Lista de tablas que necesitan columnas de tiempo
    FOR t IN SELECT table_name 
             FROM information_schema.tables 
             WHERE table_schema = 'public' 
               AND table_name IN ('categories', 'products', 'customers', 'inventory', 'sales', 'sale_items', 'reorder_suggestions', 'supplier_visits', 'expiring_products') 
    LOOP
        -- Agregar created_at
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'created_at') THEN
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()', t);
        END IF;

        -- Agregar updated_at
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t AND column_name = 'updated_at') THEN
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()', t);
        END IF;
    END LOOP;

    -- Reparar columnas estructurales específicas
    -- Tabla inventory
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'reserved') THEN
        ALTER TABLE public.inventory ADD COLUMN reserved INTEGER DEFAULT 0;
    END IF;
    
    -- Tabla supplier_visits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_visits' AND column_name = 'status') THEN
        ALTER TABLE public.supplier_visits ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
    END IF;

    -- Tabla expiring_products
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expiring_products' AND column_name = 'days_until_expiry') THEN
        ALTER TABLE public.expiring_products ADD COLUMN days_until_expiry INTEGER;
    END IF;

    RAISE NOTICE '✅ Esquema estandarizado';
END $$;

-- ===============================================================
-- FASE 2: PRODUCTOS, CATEGORÍAS Y CLIENTES
-- ===============================================================

-- Asegurar categorías básicas
INSERT INTO public.categories (name, description)
VALUES
  ('Bebidas', 'Refrescos, jugos, agua y bebidas'),
  ('Lácteos', 'Leche, quesos, yogurt'),
  ('Panadería', 'Pan, tortillas, pan dulce'),
  ('Botanas', 'Papas, galletas, dulces'),
  ('Despensa', 'Arroz, frijol, aceite, café'),
  ('Enlatados', 'Atún, chiles, verduras'),
  ('Higiene', 'Jabón, papel, limpieza'),
  ('Carnes Frías', 'Jamón, salchichas, queso')
ON CONFLICT (name) DO NOTHING;

-- Insertar Productos (Subset representativo)
INSERT INTO public.products (name, sku, barcode, category_id, price, cost_price, description, is_active, track_inventory, min_stock)
SELECT m.name, m.sku, m.barcode, c.id, m.price, m.cost, m.desc, true, true, m.min
FROM (VALUES 
  ('Coca Cola 600ml', 'CC600', '7501055365100', 'Bebidas', 15.00, 10.50, 'Refresco de cola', 24),
  ('Leche Lala Entera 1L', 'LLE1L', '7501055300110', 'Lácteos', 24.00, 18.00, 'Leche entera', 24),
  ('Pan Blanco Bimbo', 'PBG680', '7501055310680', 'Panadería', 42.00, 32.00, 'Pan de caja', 12),
  ('Sabritas Adobadas 45g', 'SAB45', '7501055320045', 'Botanas', 18.00, 12.50, 'Papas fritas', 36),
  ('Huevo Blanco 18 pzas', 'HVO18', '7501055320018', 'Lácteos', 65.00, 52.00, 'Huevos frescos', 12),
  ('Arroz Verde Valle 1kg', 'ARR1K', '7501055340100', 'Despensa', 28.00, 21.00, 'Arroz blanco', 20),
  ('Frijol Negro 1kg', 'FRN1K', '7501055341100', 'Despensa', 32.00, 24.00, 'Frijol negro', 18),
  ('Aceite Vegetal 1L', 'ACV1L', '7501055342110', 'Despensa', 38.00, 28.00, 'Aceite cocina', 12),
  ('Atún Dolores Agua', 'ATD140', '7501055354140', 'Despensa', 22.00, 16.50, 'Atún lata', 24),
  ('Café Nescafé 225g', 'CAF225', '7501055348225', 'Despensa', 98.00, 78.00, 'Café soluble', 10)
) AS m(name, sku, barcode, cat_name, price, cost, "desc", min)
JOIN public.categories c ON c.name = m.cat_name
ON CONFLICT (sku) DO NOTHING;

-- Clientes
INSERT INTO public.customers (name, email, phone, address)
VALUES
  ('María López', 'maria@email.com', '5551234567', 'Calle Morelos 123'),
  ('José Rodríguez', 'jose@email.com', '5551234568', 'Av. Juárez 456'),
  ('Ana Hernández', 'ana@email.com', '5551234569', 'Calle Hidalgo 789'),
  ('Público General', NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- ===============================================================
-- FASE 3: INVENTARIO Y MOVIMIENTOS HISTÓRICOS
-- ===============================================================

-- 1. Inicializar Inventario
WITH store_data AS (SELECT id as store_id FROM public.stores LIMIT 1)
INSERT INTO public.inventory (product_id, store_id, stock, reserved)
SELECT p.id, s.store_id, 100, 0
FROM public.products p CROSS JOIN store_data s
ON CONFLICT (product_id, store_id) DO UPDATE SET stock = 100;

-- 2. Función temporal para generar ventas de 2 meses
-- (Usamos una técnica de generación masiva para evitar timeouts)
DO $$
DECLARE
  v_store_id UUID;
  v_user_id UUID;
  v_customer_id UUID;
  v_sale_id UUID;
  v_time TIMESTAMP;
  v_prod record;
  v_qty INTEGER;
BEGIN
  SELECT id INTO v_store_id FROM public.stores LIMIT 1;
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  SELECT id INTO v_customer_id FROM public.customers WHERE name = 'Público General' LIMIT 1;

  -- Generar 5 ventas diarias por los últimos 60 días
  FOR d IN 0..60 LOOP
    FOR s IN 1..5 LOOP
      v_sale_id := gen_random_uuid();
      v_time := NOW() - (d * INTERVAL '1 day') - (s * INTERVAL '2 hours');
      
      INSERT INTO public.sales (id, store_id, user_id, customer_id, total_amount, payment_method, status, created_at)
      VALUES (v_sale_id, v_store_id, v_user_id, v_customer_id, 0, 'cash', 'completed', v_time);

      -- Cada venta tiene 2 productos aleatorios
      FOR p IN 1..2 LOOP
        SELECT id, price INTO v_prod FROM public.products ORDER BY RANDOM() LIMIT 1;
        v_qty := 1 + FLOOR(RANDOM() * 2)::INTEGER;
        
        INSERT INTO public.sale_items (sale_id, product_id, quantity, unit_price, subtotal, created_at)
        VALUES (v_sale_id, v_prod.id, v_qty, v_prod.price, v_prod.price * v_qty, v_time);
        
        -- Actualizar total de venta e inventario
        UPDATE public.sales SET total_amount = total_amount + (v_prod.price * v_qty) WHERE id = v_sale_id;
        UPDATE public.inventory SET stock = stock - v_qty WHERE product_id = v_prod.id AND store_id = v_store_id;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

COMMIT;

-- VERIFICACIÓN FINAL
SELECT 
  (SELECT COUNT(*) FROM public.products) as productos,
  (SELECT COUNT(*) FROM public.sales) as ventas_60_dias,
  (SELECT SUM(total_amount) FROM public.sales) as total_ventas;
