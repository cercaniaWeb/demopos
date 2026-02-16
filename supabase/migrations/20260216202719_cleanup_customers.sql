-- 1. Limpieza de duplicados por nombre
DELETE FROM public.customers a USING public.customers b
WHERE a.id < b.id AND a.name = b.name;

-- 2. Asegurar que RLS permita lectura pública si es necesario (o al menos para autenticados)
DROP POLICY IF EXISTS "Public can read customers" ON public.customers;
CREATE POLICY "Public can read customers" ON public.customers FOR SELECT USING (true);

-- 3. Inserción garantizada de Juan Pérez y otros 5 principales para test rápido
INSERT INTO public.customers (name, email, phone, address)
VALUES 
  ('Juan Pérez', 'juan.perez@email.com', '5551112233', 'Calle Falsa 123'),
  ('Maria Garcia', 'maria.garcia@email.com', '5552223344', 'Av. Siempre Viva 742'),
  ('Ricardo Montaner', 'ricardo.m@email.com', '5553334455', 'Calle Luna 456'),
  ('Laura Pausini', 'laura.p@email.com', '5554445566', 'Calle Sol 789'),
  ('Luis Miguel', 'el.sol@email.com', '5555556677', 'Playa Azul 10')
ON CONFLICT DO NOTHING;
