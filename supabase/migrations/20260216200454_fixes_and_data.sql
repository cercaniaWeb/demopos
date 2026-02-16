-- 1. Agregar columna faltante en supplier_visits
ALTER TABLE public.supplier_visits 
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE;

-- 2. Asegurar que las categorías tengan ID predecibles o mapearlos correctamente
-- (Ya tenemos categorías creadas, vamos a mapearlas a los productos)

-- 3. Vincular productos con sus categorías actuales
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE 
  (p.name ILIKE '%Coca%' OR p.name ILIKE '%Bebida%' OR p.name ILIKE '%Agua%') AND c.name = 'Bebidas'
  OR (p.name ILIKE '%Leche%' OR p.name ILIKE '%Lala%' OR p.name ILIKE '%Huevo%') AND c.name = 'Lácteos'
  OR (p.name ILIKE '%Bimbo%' OR p.name ILIKE '%Pan%') AND c.name = 'Panadería'
  OR (p.name ILIKE '%Sabritas%' OR p.name ILIKE '%Papas%' OR p.name ILIKE '%Galletas%') AND c.name = 'Botanas'
  OR (p.name ILIKE '%Arroz%' OR p.name ILIKE '%Frijol%' OR p.name ILIKE '%Aceite%') AND c.name = 'Despensa';

-- 4. Poblar Clientes (30 registros)
INSERT INTO public.customers (name, email, phone, address)
VALUES
  ('Juan Pérez', 'juan.perez@email.com', '5551112233', 'Calle Falsa 123'),
  ('Maria Garcia', 'maria.garcia@email.com', '5552223344', 'Av. Siempre Viva 742'),
  ('Ricardo Montaner', 'ricardo.m@email.com', '5553334455', 'Calle Luna 456'),
  ('Laura Pausini', 'laura.p@email.com', '5554445566', 'Calle Sol 789'),
  ('Luis Miguel', 'el.sol@email.com', '5555556677', 'Playa Azul 10'),
  ('Thalia Mottola', 'thalia@email.com', '5556667788', 'Valle Central 22'),
  ('Chayanne Figueroa', 'chayanne@email.com', '5557778899', 'Isla del Sol 5'),
  ('Shakira Mebarak', 'shakira@email.com', '5558889900', 'Barranquilla 123'),
  ('Carlos Vives', 'carlos@email.com', '5559990011', 'Santa Marta 44'),
  ('Paulina Rubio', 'paulina@email.com', '5550001122', 'Dorada 77'),
  ('Enrique Iglesias', 'enrique@email.com', '5551113344', 'Madrid 88'),
  ('Alejandro Sanz', 'alejandro@email.com', '5552224455', 'Sevilla 99'),
  ('Marc Anthony', 'marc@email.com', '5553335566', 'New York 11'),
  ('Jennifer Lopez', 'jlo@email.com', '5554446677', 'Bronx 22'),
  ('Ricky Martin', 'ricky@email.com', '5555557788', 'San Juan 33'),
  ('Daddy Yankee', 'daddy@email.com', '5556668899', 'Gasolina 44'),
  ('Bad Bunny', 'benito@email.com', '5557779900', 'Conejo Malo 55'),
  ('Karol G', 'karolg@email.com', '5558880011', 'Medellín 66'),
  ('J Balvin', 'jbalvin@email.com', '5559991122', 'Colores 77'),
  ('Maluma', 'maluma@email.com', '5550002233', 'Papi Juancho 88'),
  ('Camilo Echeverry', 'camilo@email.com', '5551114455', 'Indigo 99'),
  ('Evaluna Montaner', 'evaluna@email.com', '5552225566', 'Camas 11'),
  ('Rosalia Vila', 'rosalia@email.com', '5553336677', 'Motomami 22'),
  ('Sebastian Yatra', 'sebastian@email.com', '5554447788', 'Tacones Rojos 33'),
  ('Tini Stoessel', 'tini@email.com', '5555558899', 'Fresa 44'),
  ('Danna Paola', 'danna@email.com', '5556669900', 'Mala Fama 55'),
  ('Kenia Os', 'kenia@email.com', '5557770011', 'Mazatlán 66'),
  ('Christian Nodal', 'christian@email.com', '5558881122', 'Botella tras Botella 77'),
  ('Peso Pluma', 'hassan@email.com', '5559992233', 'Zapopan 88'),
  ('Natanael Cano', 'natanael@email.com', '5550003344', 'Hermosillo 99')
ON CONFLICT DO NOTHING;

-- 5. Ventas Históricas (Versión Optimizada en Batches)
-- Generamos ventas para los últimos 30 días únicamente para evitar timeout
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

  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (name) VALUES ('Público General') RETURNING id INTO v_customer_id;
  END IF;

  -- Generar 3 ventas diarias por los últimos 30 días (Total ~90 ventas)
  FOR d IN 1..30 LOOP
    FOR s IN 1..3 LOOP
      v_sale_id := gen_random_uuid();
      v_time := NOW() - (d * INTERVAL '1 day') - (s * INTERVAL '3 hours');
      
      INSERT INTO public.sales (id, store_id, user_id, customer_id, total_amount, payment_method, status, created_at)
      VALUES (v_sale_id, v_store_id, v_user_id, v_customer_id, 0, 'cash', 'completed', v_time);

      -- Cada venta tiene 1-3 productos
      FOR p IN 1..(1 + FLOOR(RANDOM() * 3)::INTEGER) LOOP
        SELECT id, price INTO v_prod FROM public.products ORDER BY RANDOM() LIMIT 1;
        IF v_prod.id IS NOT NULL THEN
          v_qty := 1 + FLOOR(RANDOM() * 2)::INTEGER;
          
          INSERT INTO public.sale_items (sale_id, product_id, quantity, unit_price, subtotal, created_at)
          VALUES (v_sale_id, v_prod.id, v_qty, v_prod.price, v_prod.price * v_qty, v_time);
          
          UPDATE public.sales SET total_amount = total_amount + (v_prod.price * v_qty) WHERE id = v_sale_id;
          UPDATE public.inventory SET stock = stock - v_qty WHERE product_id = v_prod.id AND store_id = v_store_id;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
