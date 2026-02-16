-- ===============================================================
-- SCRIPT PARA POBLAR BASE DE DATOS CON 2 MESES DE OPERACIÓN
-- Tienda de Abarrotes - Datos Realistas
-- ===============================================================

-- INSTRUCCIONES:
-- 1. Ve a Supabase Dashboard > SQL Editor
-- 2. Copia este archivo completo
-- 3. Ejecuta (puede tardar 1-2 minutos)
-- ===============================================================

BEGIN;

-- ===============================================================
-- PARTE 1: CATEGORÍAS DE PRODUCTOS
-- ===============================================================

INSERT INTO public.categories (id, name, description, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Bebidas', 'Refrescos, jugos, agua y bebidas en general', NOW(), NOW()),
  (gen_random_uuid(), 'Lácteos', 'Leche, quesos, yogurt y derivados', NOW(), NOW()),
  (gen_random_uuid(), 'Panadería', 'Pan, tortillas y productos de panadería', NOW(), NOW()),
  (gen_random_uuid(), 'Botanas', 'Papas, galletas, dulces y snacks', NOW(), NOW()),
  (gen_random_uuid(), 'Despensa', 'Arroz, frijol, aceite, y productos básicos', NOW(), NOW()),
  (gen_random_uuid(), 'Enlatados', 'Conservas y productos enlatados', NOW(), NOW()),
  (gen_random_uuid(), 'Higiene', 'Productos de limpieza e higiene personal', NOW(), NOW()),
  (gen_random_uuid(), 'Carnes Frías', 'Jamón, salchicha y embutidos', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- ===============================================================
-- PARTE 2: PRODUCTOS CON IMÁGENES
-- ===============================================================

WITH category_ids AS (
  SELECT 
    MAX(CASE WHEN name = 'Bebidas' THEN id END) as bebidas_id,
    MAX(CASE WHEN name = 'Lácteos' THEN id END) as lacteos_id,
    MAX(CASE WHEN name = 'Panadería' THEN id END) as panaderia_id,
    MAX(CASE WHEN name = 'Botanas' THEN id END) as botanas_id,
    MAX(CASE WHEN name = 'Despensa' THEN id END) as despensa_id,
    MAX(CASE WHEN name = 'Enlatados' THEN id END) as enlatados_id,
    MAX(CASE WHEN name = 'Higiene' THEN id END) as higiene_id,
    MAX(CASE WHEN name = 'Carnes Frías' THEN id END) as carnes_id
  FROM public.categories
),
inserted_products AS (
  INSERT INTO public.products (
    id, name, sku, barcode, category_id, price, cost_price, 
    description, image_url, is_active, track_inventory, 
    min_stock, created_at, updated_at
  )
  SELECT * FROM (VALUES
    -- BEBIDAS (10 productos)
    (gen_random_uuid(), 'Coca Cola 600ml', 'CC600', '7501055365100', (SELECT bebidas_id FROM category_ids), 15.00, 10.50, 'Refresco de cola 600ml', 'https://placehold.co/400x400/red/white?text=Coca+Cola', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Coca Cola 2.5L', 'CC25L', '7501055365254', (SELECT bebidas_id FROM category_ids), 35.00, 25.00, 'Refresco de cola 2.5 litros', 'https://placehold.co/400x400/red/white?text=Coca+2.5L', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Pepsi 600ml', 'PP600', '7501055301054', (SELECT bebidas_id FROM category_ids), 14.00, 10.00, 'Refresco de cola Pepsi 600ml', 'https://placehold.co/400x400/blue/white?text=Pepsi', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Agua Ciel 1L', 'AG1L', '7501055320010', (SELECT bebidas_id FROM category_ids), 8.00, 5.50, 'Agua purificada 1 litro', 'https://placehold.co/400x400/skyblue/white?text=Agua+Ciel', true, true, 48, NOW(), NOW()),
    (gen_random_uuid(), 'Jugo Del Valle Naranja 1L', 'JVN1L', '7501055385010', (SELECT bebidas_id FROM category_ids), 18.00, 13.00, 'Jugo de naranja 1 litro', 'https://placehold.co/400x400/orange/white?text=Jugo+Naranja', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Sprite 600ml', 'SP600', '7501055366100', (SELECT bebidas_id FROM category_ids), 14.50, 10.20, 'Refresco de lima limón 600ml', 'https://placehold.co/400x400/green/white?text=Sprite', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Monster Energy', 'MON473', '07084003001', (SELECT bebidas_id FROM category_ids), 28.00, 20.00, 'Bebida energética 473ml', 'https://placehold.co/400x400/black/lime?text=Monster', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Electrolit 625ml', 'ELC625', '7501055301625', (SELECT bebidas_id FROM category_ids), 16.00, 11.50, 'Bebida rehidratante', 'https://placehold.co/400x400/yellow/black?text=Electrolit', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Jumex Durazno 1L', 'JMD1L', '7501055306010', (SELECT bebidas_id FROM category_ids), 15.00, 10.80, 'Néctar de durazno 1L', 'https://placehold.co/400x400/peach/white?text=Jumex', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Té Fuze Tea Limón 600ml', 'FTL600', '7501055308600', (SELECT bebidas_id FROM category_ids), 17.00, 12.50, 'Té helado sabor limón', 'https://placehold.co/400x400/yellow/brown?text=Fuze+Tea', true, true, 18, NOW(), NOW()),
    
    -- LÁCTEOS (8 productos)
    (gen_random_uuid(), 'Leche Lala Entera 1L', 'LLE1L', '7501055300110', (SELECT lacteos_id FROM category_ids), 24.00, 18.00, 'Leche entera ultrapasteurizada 1L', 'https://placehold.co/400x400/white/blue?text=Lala+Leche', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Huevo Blanco 18 pzas', 'HVO18', '7501055320018', (SELECT lacteos_id FROM category_ids), 65.00, 52.00, 'Huevo de gallina blanco paquete 18', 'https://placehold.co/400x400/beige/brown?text=Huevos+18', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Yogurt Danone Natural 1L', 'YDN1L', '7501055301010', (SELECT lacteos_id FROM category_ids), 32.00, 24.00, 'Yogurt natural 1 litro', 'https://placehold.co/400x400/white/red?text=Danone', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Queso Panela Lala 400g', 'QPL400', '7501055304400', (SELECT lacteos_id FROM category_ids), 58.00, 45.00, 'Queso panela 400 gramos', 'https://placehold.co/400x400/white/darkblue?text=Panela', true, true, 8, NOW(), NOW()),
    (gen_random_uuid(), 'Crema Lala 200ml', 'CRL200', '7501055302200', (SELECT lacteos_id FROM category_ids), 18.00, 13.50, 'Crema ácida 200ml', 'https://placehold.co/400x400/ivory/blue?text=Crema', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Mantequilla Gloria 400g', 'MGL400', '7501055303400', (SELECT lacteos_id FROM category_ids), 48.00, 38.00, 'Mantequilla con sal 400g', 'https://placehold.co/400x400/yellow/red?text=Mantequilla', true, true, 10, NOW(), NOW()),
    (gen_random_uuid(), 'Queso Oaxaca 400g', 'QOX400', '7501055305400', (SELECT lacteos_id FROM category_ids), 68.00, 52.00, 'Queso oaxaca 400g', 'https://placehold.co/400x400/white/green?text=Oaxaca', true, true, 8, NOW(), NOW()),
    (gen_random_uuid(), 'Yogurt Griego Chobani', 'YGC150', '7501055306150', (SELECT lacteos_id FROM category_ids), 24.00, 18.00, 'Yogurt griego natural 150g', 'https://placehold.co/400x400/white/navy?text=Chobani', true, true, 18, NOW(), NOW()),
    
    -- PANADERÍA (6 productos)
    (gen_random_uuid(), 'Pan Blanco Bimbo Grande', 'PBG680', '7501055310680', (SELECT panaderia_id FROM category_ids), 42.00, 32.00, 'Pan de caja blanco grande', 'https://placehold.co/400x400/white/red?text=Pan+Bimbo', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Pan Integral Bimbo', 'PIB680', '7501055311680', (SELECT panaderia_id FROM category_ids), 45.00, 34.00, 'Pan integral 680g', 'https://placehold.co/400x400/brown/red?text=Integral', true, true, 10, NOW(), NOW()),
    (gen_random_uuid(), 'Tortillas de Maíz 1kg', 'TOM1K', '7501055312100', (SELECT panaderia_id FROM category_ids), 22.00, 16.00, 'Tortillas de maíz 1 kilogramo', 'https://placehold.co/400x400/yellow/red?text=Tortillas', true, true, 20, NOW(), NOW()),
    (gen_random_uuid(), 'Tortillas de Harina 500g', 'TOH500', '7501055313500', (SELECT panaderia_id FROM category_ids), 28.00, 21.00, 'Tortillas de harina 500g', 'https://placehold.co/400x400/beige/orange?text=Tortilla+Harina', true, true, 15, NOW(), NOW()),
    (gen_random_uuid(), 'Bolillo 6 piezas', 'BOL6', '7501055314006', (SELECT panaderia_id FROM category_ids), 12.00, 8.00, 'Bolillo tradicional paquete 6', 'https://placehold.co/400x400/wheat/brown?text=Bolillos', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Pan Dulce Marinela Gansito', 'PDG5', '7501055315005', (SELECT panaderia_id FROM category_ids), 32.00, 24.00, 'Gansito paquete 5 piezas', 'https://placehold.co/400x400/red/yellow?text=Gansito', true, true, 24, NOW(), NOW()),
    
    -- BOTANAS (12 productos)
    (gen_random_uuid(), 'Sabritas Adobadas 45g', 'SAB45', '7501055320045', (SELECT botanas_id FROM category_ids), 18.00, 12.50, 'Papas Sabritas adobadas 45g', 'https://placehold.co/400x400/red/yellow?text=Sabritas', true, true, 36, NOW(), NOW()),
    (gen_random_uuid(), 'Sabritas Originales 170g', 'SAO170', '7501055321170', (SELECT botanas_id FROM category_ids), 38.00, 28.00, 'Papas Sabritas originales 170g', 'https://placehold.co/400x400/red/white?text=Sabritas+170g', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Doritos Nacho 62g', 'DOR62', '7501055322062', (SELECT botanas_id FROM category_ids), 19.00, 13.50, 'Doritos nacho 62g', 'https://placehold.co/400x400/orange/red?text=Doritos', true, true, 36, NOW(), NOW()),
    (gen_random_uuid(), 'Cheetos Poffs 42g', 'CHE42', '7501055323042', (SELECT botanas_id FROM category_ids), 17.00, 12.00, 'Cheetos poffs queso 42g', 'https://placehold.co/400x400/yellow/red?text=Cheetos', true, true, 36, NOW(), NOW()),
    (gen_random_uuid(), 'Ruffles Queso 45g', 'RUF45', '7501055324045', (SELECT botanas_id FROM category_ids), 18.00, 12.50, 'Ruffles queso 45g', 'https://placehold.co/400x400/blue/yellow?text=Ruffles', true, true, 36, NOW(), NOW()),
    (gen_random_uuid(), 'Takis Fuego 62g', 'TAK62', '7501055325062', (SELECT botanas_id FROM category_ids), 20.00, 14.50, 'Takis fuego 62g', 'https://placehold.co/400x400/purple/red?text=Takis', true, true, 48, NOW(), NOW()),
    (gen_random_uuid(), 'Galletas Oreo 432g', 'ORE432', '7501055326432', (SELECT botanas_id FROM category_ids), 52.00, 40.00, 'Galletas Oreo paquete familiar', 'https://placehold.co/400x400/darkblue/white?text=Oreo', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Galletas Marías Gamesa 380g', 'MAR380', '7501055327380', (SELECT botanas_id FROM category_ids), 28.00, 20.00, 'Galletas Marías 380g', 'https://placehold.co/400x400/brown/yellow?text=Marias', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Chocolates M&Ms 45g', 'MMS45', '7501055328045', (SELECT botanas_id FROM category_ids), 24.00, 18.00, 'Chocolates M&Ms 45g', 'https://placehold.co/400x400/red/yellow?text=M%26Ms', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Snickers 50g', 'SNI50', '7501055329050', (SELECT botanas_id FROM category_ids), 16.00, 11.50, 'Chocolate Snickers 50g', 'https://placehold.co/400x400/brown/blue?text=Snickers', true, true, 36, NOW(), NOW()),
    (gen_random_uuid(), 'Chicles Trident Menta', 'TRI12', '7501055330012', (SELECT botanas_id FROM category_ids), 12.00, 8.50, 'Chicles Trident menta', 'https://placehold.co/400x400/green/white?text=Trident', true, true, 48, NOW(), NOW()),
    (gen_random_uuid(), 'Cacahuates Japoneses 100g', 'CAJ100', '7501055331100', (SELECT botanas_id FROM category_ids), 22.00, 16.00, 'Cacahuates japoneses 100g', 'https://placehold.co/400x400/orange/brown?text=Cacahuates', true, true, 24, NOW(), NOW()),
    
    -- DESPENSA (15 productos)
    (gen_random_uuid(), 'Arroz Blanco Verde Valle 1kg', 'ARR1K', '7501055340100', (SELECT despensa_id FROM category_ids), 28.00, 21.00, 'Arroz blanco 1 kilogramo', 'https://placehold.co/400x400/white/green?text=Arroz', true, true, 20, NOW(), NOW()),
    (gen_random_uuid(), 'Frijol Negro 1kg', 'FRN1K', '7501055341100', (SELECT despensa_id FROM category_ids), 32.00, 24.00, 'Frijol negro 1 kilogramo', 'https://placehold.co/400x400/black/yellow?text=Frijol', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Aceite Vegetal 1L', 'ACV1L', '7501055342110', (SELECT despensa_id FROM category_ids), 38.00, 28.00, 'Aceite vegetal comestible 1L', 'https://placehold.co/400x400/yellow/red?text=Aceite', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Azúcar Estándar 1kg', 'AZU1K', '7501055343100', (SELECT despensa_id FROM category_ids), 24.00, 18.00, 'Azúcar refinada 1 kilogramo', 'https://placehold.co/400x400/white/blue?text=Azucar', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Sal La Fina 1kg', 'SAL1K', '7501055344100', (SELECT despensa_id FROM category_ids), 12.00, 8.50, 'Sal refinada 1 kilogramo', 'https://placehold.co/400x400/white/red?text=Sal', true, true, 20, NOW(), NOW()),
    (gen_random_uuid(), 'Harina de Trigo 1kg', 'HAR1K', '7501055345100', (SELECT despensa_id FROM category_ids), 22.00, 16.50, 'Harina de trigo 1 kilogramo', 'https://placehold.co/400x400/beige/brown?text=Harina', true, true, 15, NOW(), NOW()),
    (gen_random_uuid(), 'Pasta Spaghetti 200g', 'SPA200', '7501055346200', (SELECT despensa_id FROM category_ids), 14.00, 10.00, 'Pasta spaghetti 200g', 'https://placehold.co/400x400/yellow/red?text=Pasta', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Sopa de Pasta Municiones 200g', 'SOM200', '7501055347200', (SELECT despensa_id FROM category_ids), 12.00, 8.50, 'Sopa de pasta municiones 200g', 'https://placehold.co/400x400/yellow/orange?text=Sopa', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Café Nescafé Clásico 225g', 'CAF225', '7501055348225', (SELECT despensa_id FROM category_ids), 98.00, 78.00, 'Café soluble Nescafé 225g', 'https://placehold.co/400x400/red/yellow?text=Nescafe', true, true, 8, NOW(), NOW()),
    (gen_random_uuid(), 'Azúcar Morena 1kg', 'AZM1K', '7501055349100', (SELECT despensa_id FROM category_ids), 26.00, 19.50, 'Azúcar morena 1kg', 'https://placehold.co/400x400/brown/yellow?text=Azucar+Morena', true, true, 15, NOW(), NOW()),
    (gen_random_uuid(), 'Avena Quaker 400g', 'AVQ400', '7501055350400', (SELECT despensa_id FROM category_ids), 34.00, 26.00, 'Avena Quaker hojuelas 400g', 'https://placehold.co/400x400/blue/yellow?text=Avena', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Consomé de Pollo Knorr 24 cubos', 'CON24', '7501055351024', (SELECT despensa_id FROM category_ids), 32.00, 24.00, 'Consomé de pollo 24 cubos', 'https://placehold.co/400x400/yellow/red?text=Knorr', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Mayonesa McCormick 380g', 'MAY380', '7501055352380', (SELECT despensa_id FROM category_ids), 42.00, 32.00, 'Mayonesa McCormick 380g', 'https://placehold.co/400x400/yellow/black?text=Mayonesa', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Salsa Valentina 370ml', 'SAV370', '7501055353370', (SELECT despensa_id FROM category_ids), 18.00, 13.00, 'Salsa picante Valentina 370ml', 'https://placehold.co/400x400/yellow/red?text=Valentina', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Atún Dolores en Agua 140g', 'ATD140', '7501055354140', (SELECT despensa_id FROM category_ids), 22.00, 16.50, 'Atún en agua lata 140g', 'https://placehold.co/400x400/blue/yellow?text=Atun', true, true, 36, NOW(), NOW()),
    
    -- ENLATADOS (8 productos)
    (gen_random_uuid(), 'Frijoles Refritos La Costeña 430g', 'FRR430', '7501055360430', (SELECT enlatados_id FROM category_ids), 24.00, 18.00, 'Frijoles refritos lata 430g', 'https://placehold.co/400x400/brown/red?text=Frijoles', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Chiles Jalapeños La Costeña 220g', 'CHJ220', '7501055361220', (SELECT enlatados_id FROM category_ids), 18.00, 13.00, 'Chiles jalapeños enteros 220g', 'https://placehold.co/400x400/green/red?text=Jalape%C3%B1os', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Elote Amarillo 410g', 'ELO410', '7501055362410', (SELECT enlatados_id FROM category_ids), 22.00, 16.00, 'Granos de elote amarillo 410g', 'https://placehold.co/400x400/yellow/green?text=Elote', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Puré de Tomate 210g', 'PTO210', '7501055363210', (SELECT enlatados_id FROM category_ids), 14.00, 10.00, 'Puré de tomate 210g', 'https://placehold.co/400x400/red/white?text=Pure+Tomate', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Salsa Roja La Costeña 240g', 'SAR240', '7501055364240', (SELECT enlatados_id FROM category_ids), 16.00, 11.50, 'Salsa roja casera 240g', 'https://placehold.co/400x400/red/yellow?text=Salsa+Roja', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Chiles Chipotles 380g', 'CHC380', '7501055365380', (SELECT enlatados_id FROM category_ids), 28.00, 21.00, 'Chiles chipotles adobados 380g', 'https://placehold.co/400x400/darkred/yellow?text=Chipotles', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Sardina en Tomate 425g', 'SAT425', '7501055366425', (SELECT enlatados_id FROM category_ids), 26.00, 19.50, 'Sardina en salsa de tomate 425g', 'https://placehold.co/400x400/blue/red?text=Sardina', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Verduras Mixtas 400g', 'VEM400', '7501055367400', (SELECT enlatados_id FROM category_ids), 20.00, 14.50, 'Verduras mexicanas mixtas 400g', 'https://placehold.co/400x400/green/yellow?text=Verduras', true, true, 12, NOW(), NOW()),
    
    -- HIGIENE (10 productos)
    (gen_random_uuid(), 'Jabón en Barra Roma 200g', 'JAR200', '7501055370200', (SELECT higiene_id FROM category_ids), 12.00, 8.50, 'Jabón de tocador Roma 200g', 'https://placehold.co/400x400/pink/white?text=Jabon+Roma', true, true, 36, NOW(), NOW()),
    (gen_random_uuid(), 'Jabón Líquido para Ropa 1L', 'JAL1L', '7501055371110', (SELECT higiene_id FROM category_ids), 45.00, 34.00, 'Jabón líquido concentrado 1L', 'https://placehold.co/400x400/blue/white?text=Jabon+Liquido', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Shampoo Sedal 350ml', 'SHA350', '7501055372350', (SELECT higiene_id FROM category_ids), 38.00, 28.50, 'Shampoo Sedal 350ml', 'https://placehold.co/400x400/purple/white?text=Sedal', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Papel Higiénico Regio 4 Rollos', 'PAP4', '7501055373004', (SELECT higiene_id FROM category_ids), 28.00, 21.00, 'Papel higiénico doble hoja 4 rollos', 'https://placehold.co/400x400/white/red?text=Papel+4', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Pasta Dental Colgate 75ml', 'PDE75', '7501055374075', (SELECT higiene_id FROM category_ids), 32.00, 24.00, 'Pasta dental Colgate triple acción', 'https://placehold.co/400x400/red/white?text=Colgate', true, true, 18, NOW(), NOW()),
    (gen_random_uuid(), 'Desodorante Rexona Hombre 90g', 'DRH90', '7501055375090', (SELECT higiene_id FROM category_ids), 48.00, 36.00, 'Desodorante en barra hombre 90g', 'https://placehold.co/400x400/blue/white?text=Rexona', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Cloro Cloralex 1L', 'CLO1L', '7501055376110', (SELECT higiene_id FROM category_ids), 22.00, 16.00, 'Cloro Cloralex regular 1L', 'https://placehold.co/400x400/yellow/blue?text=Cloralex', true, true, 15, NOW(), NOW()),
    (gen_random_uuid(), 'Servilletas Pétalo 100u', 'SER100', '7501055377100', (SELECT higiene_id FROM category_ids), 18.00, 13.00, 'Servilletas de papel 100 unidades', 'https://placehold.co/400x400/white/pink?text=Servilletas', true, true, 24, NOW(), NOW()),
    (gen_random_uuid(), 'Pañales Huggies Etapa 3', 'PAÑ36', '7501055378036', (SELECT higiene_id FROM category_ids), 248.00, 198.00, 'Pañales Huggies etapa 3, 36 pzas', 'https://placehold.co/400x400/lightblue/white?text=Huggies', true, true, 5, NOW(), NOW()),
    (gen_random_uuid(), 'Rasuradoras Bic 5u', 'RAS5', '7501055379005', (SELECT higiene_id FROM category_ids), 34.00, 26.00, 'Rasuradoras desechables 5 unidades', 'https://placehold.co/400x400/orange/white?text=Bic', true, true, 18, NOW(), NOW()),
    
    -- CARNES FRÍAS (6 productos)
    (gen_random_uuid(), 'Jamón FUD 500g', 'JAF500', '7501055380500', (SELECT carnes_id FROM category_ids), 78.00, 62.00, 'Jamón de pierna FUD 500g', 'https://placehold.co/400x400/pink/red?text=Jamon+FUD', true, true, 8, NOW(), NOW()),
    (gen_random_uuid(), 'Salchicha FUD 500g', 'SAF500', '7501055381500', (SELECT carnes_id FROM category_ids), 68.00, 54.00, 'Salchicha de pavo FUD 500g', 'https://placehold.co/400x400/red/yellow?text=Salchicha', true, true, 10, NOW(), NOW()),
    (gen_random_uuid(), 'Queso Americano Kraft 280g', 'QAK280', '7501055382280', (SELECT carnes_id FROM category_ids), 58.00, 45.00, 'Queso americano amarillo 280g', 'https://placehold.co/400x400/yellow/red?text=Kraft', true, true, 12, NOW(), NOW()),
    (gen_random_uuid(), 'Tocino FUD 200g', 'TOF200', '7501055383200', (SELECT carnes_id FROM category_ids), 48.00, 38.00, 'Tocino ahumado 200g', 'https://placehold.co/400x400/red/white?text=Tocino', true, true, 8, NOW(), NOW()),
    (gen_random_uuid(), 'Chorizo Argentino 400g', 'CHA400', '7501055384400', (SELECT carnes_id FROM category_ids), 52.00, 41.00, 'Chorizo argentino 400g', 'https://placehold.co/400x400/red/yellow?text=Chorizo', true, true, 10, NOW(), NOW()),
    (gen_random_uuid(), 'Salami FUD 250g', 'SAL250', '7501055385250', (SELECT carnes_id FROM category_ids), 64.00, 51.00, 'Salami tipo italiano 250g', 'https://placehold.co/400x400/darkred/yellow?text=Salami', true, true, 8, NOW(), NOW())
  ) AS data(id, name, sku, barcode, category_id, price, cost_price, description, image_url, is_active, track_inventory, min_stock, created_at, updated_at)
  RETURNING id, name, sku
)
SELECT COUNT(*) as productos_insertados FROM inserted_products;

-- ===============================================================
-- PARTE 3: CLIENTES (30 clientes realistas)
-- ===============================================================

WITH inserted_customers AS (
  INSERT INTO public.customers (
    id, name, email, phone, address, created_at, updated_at
  )
  VALUES
    (gen_random_uuid(), 'María Guadalupe López', 'maria.lopez@email.com', '5551234567', 'Calle Morelos 123, Col. Centro', NOW() - INTERVAL '60 days', NOW()),
    (gen_random_uuid(), 'José Luis Rodríguez', 'jose.rodriguez@email.com', '5551234568', 'Av. Juárez 456, Col. Norte', NOW() - INTERVAL '58 days', NOW()),
    (gen_random_uuid(), 'Ana María Hernández', 'ana.hernandez@email.com', '5551234569', 'Calle Hidalgo 789, Col. Sur', NOW() - INTERVAL '55 days', NOW()),
    (gen_random_uuid(), 'Carlos Alberto Martínez', 'carlos.martinez@email.com', '5551234570', 'Calle Independencia 321, Col. Este', NOW() - INTERVAL '52 days', NOW()),
    (gen_random_uuid(), 'Rosa Elena García', 'rosa.garcia@email.com', '5551234571', 'Av. Revolución 654, Col. Oeste', NOW() - INTERVAL '50 days', NOW()),
    (gen_random_uuid(), 'Francisco Javier Sánchez', 'francisco.sanchez@email.com', '5551234572', 'Calle Allende 987, Col. Centro', NOW() - INTERVAL '48 days', NOW()),
    (gen_random_uuid(), 'Laura Patricia Ramírez', 'laura.ramirez@email.com', '5551234573', 'Av. Reforma 147, Col. Norte', NOW() - INTERVAL '45 days', NOW()),
    (gen_random_uuid(), 'Miguel Ángel Torres', 'miguel.torres@email.com', '5551234574', 'Calle Guerrero 258, Col. Sur', NOW() - INTERVAL '43 days', NOW()),
    (gen_random_uuid(), 'Guadalupe Fernández', 'guadalupe.fernandez@email.com', '5551234575', 'Av. México 369, Col. Este', NOW() - INTERVAL '40 days', NOW()),
    (gen_random_uuid(), 'Roberto Carlos Flores', 'roberto.flores@email.com', '5551234576', 'Calle Zaragoza 741, Col. Oeste', NOW() - INTERVAL '38 days', NOW()),
    (gen_random_uuid(), 'Carmen Cecilia Gómez', 'carmen.gomez@email.com', '5551234577', 'Av. Constitución 852, Col. Centro', NOW() - INTERVAL '35 days', NOW()),
    (gen_random_uuid(), 'Antonio Pérez', 'antonio.perez@email.com', '5551234578', 'Calle Madero 963, Col. Norte', NOW() - INTERVAL '32 days', NOW()),
    (gen_random_uuid(), 'Silvia Beatriz Díaz', 'silvia.diaz@email.com', '5551234579', 'Av. Libertad 159, Col. Sur', NOW() - INTERVAL '30 days', NOW()),
    (gen_random_uuid(), 'Jorge Eduardo Cruz', 'jorge.cruz@email.com', '5551234580', 'Calle Victoria 357, Col. Este', NOW() - INTERVAL '28 days', NOW()),
    (gen_random_uuid(), 'Teresa de Jesús Morales', 'teresa.morales@email.com', '5551234581', 'Av. Progreso 468, Col. Oeste', NOW() - INTERVAL '25 days', NOW()),
    (gen_random_uuid(), 'Ricardo Jiménez', 'ricardo.jimenez@email.com', '5551234582', 'Calle Paz 579, Col. Centro', NOW() - INTERVAL '23 days', NOW()),
    (gen_random_uuid(), 'Patricia Ruiz', 'patricia.ruiz@email.com', '5551234583', 'Av. Esperanza 681, Col. Norte', NOW() - INTERVAL '20 days', NOW()),
    (gen_random_uuid(), 'Raúl Mendoza', 'raul.mendoza@email.com', '5551234584', 'Calle Unión 792, Col. Sur', NOW() - INTERVAL '18 days', NOW()),
    (gen_random_uuid(), 'Verónica Castillo', 'veronica.castillo@email.com', '5551234585', 'Av. Trabajo 893, Col. Este', NOW() - INTERVAL '15 days', NOW()),
    (gen_random_uuid(), 'Fernando Reyes', 'fernando.reyes@email.com', '5551234586', 'Calle Comercio 904, Col. Oeste', NOW() - INTERVAL '12 days', NOW()),
    (gen_random_uuid(), 'Mónica Ortiz', 'monica.ortiz@email.com', '5551234587', 'Av. Industrial 105, Col. Centro', NOW() - INTERVAL '10 days', NOW()),
    (gen_random_uuid(), 'Arturo Vargas', 'arturo.vargas@email.com', '5551234588', 'Calle Agrícola 216, Col. Norte', NOW() - INTERVAL '8 days', NOW()),
    (gen_random_uuid(), 'Gabriela Herrera', 'gabriela.herrera@email.com', '5551234589', 'Av. Nacional 327, Col. Sur', NOW() - INTERVAL '6 days', NOW()),
    (gen_random_uuid(), 'Daniel Medina', 'daniel.medina@email.com', '5551234590', 'Calle Popular 438, Col. Este', NOW() - INTERVAL '5 days', NOW()),
    (gen_random_uuid(), 'Claudia Silva', 'claudia.silva@email.com', '5551234591', 'Av. Central 549, Col. Oeste', NOW() - INTERVAL '4 days', NOW()),
    (gen_random_uuid(), 'Héctor Ramos', 'hector.ramos@email.com', '5551234592', 'Calle Principal 651, Col. Centro', NOW() - INTERVAL '3 days', NOW()),
    (gen_random_uuid(), 'Leticia Núñez', 'leticia.nunez@email.com', '5551234593', 'Av. Segunda 762, Col. Norte', NOW() - INTERVAL '2 days', NOW()),
    (gen_random_uuid(), 'Sergio Aguilar', 'sergio.aguilar@email.com', '5551234594', 'Calle Tercera 873, Col. Sur', NOW() - INTERVAL '1 day', NOW()),
    (gen_random_uuid(), 'Martha Guzmán', 'martha.guzman@email.com', '5551234595', 'Av. Cuarta 984, Col. Este', NOW(), NOW()),
    (gen_random_uuid(), 'Público General', NULL, NULL, NULL, NOW() - INTERVAL '60 days', NOW())
  RETURNING id, name
)
SELECT COUNT(*) as clientes_insertados FROM inserted_customers;

COMMIT;

-- ===============================================================
-- MENSAJE FINAL
-- ===============================================================

SELECT 
  (SELECT COUNT(*) FROM public.categories) as categorias,
  (SELECT COUNT(*) FROM public.products) as productos,
  (SELECT COUNT(*) FROM public.customers) as clientes;

-- ✅ Si ves números positivos, la primera parte está lista!
-- 📊 Ahora ejecuta el archivo PARTE_2_VENTAS.sql para poblar ventas
