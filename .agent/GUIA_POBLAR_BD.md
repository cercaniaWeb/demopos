# 📊 Guía: Poblar Base de Datos con 2 Meses de Operación

## 🎯 **Resumen**

Este proceso poblará tu base de datos con:
- ✅ **75 productos** con imágenes (categorías realistas de abarrotes)
- ✅ **30 clientes** registrados
- ✅ **1,500 - 2,000 ventas** distribuidas en 60 días
- ✅ **9 reabastecimientos** programados
- ✅ **15 productos** próximos a vencer
- ✅ **10+ sugerencias** de reorden activas

---

## 📋 **Instrucciones Paso a Paso**

### **Paso 1: Ejecutar Script de Productos y Clientes** (5 min)

1. **Abrir Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/oidnjqugqqfqwqdluufc/sql
   ```

2. **Copiar el archivo:**
   ```
   /home/lrs/demopos/.agent/POBLAR_BD_2_MESES.sql
   ```

3. **Pegar en SQL Editor y presionar "Run"**

4. **Verificar resultado:**
   Deberías ver algo como:
   ```
   ┌────────────┬───────────┬──────────┐
   │ categorías │ productos │ clientes │
   ├────────────┼───────────┼──────────┤
   │     8      │    75     │    30    │
   └────────────┴───────────┴──────────┘
   ```

---

### **Paso 2: Ejecutar Script de Ventas y Movimientos** (10-15 min)

⚠️ **IMPORTANTE:** Este script puede tardar 10-15 minutos porque genera ~1,800 ventas día por día.

1. **En el mismo SQL Editor de Supabase**

2. **Copiar el archivo:**
   ```
   /home/lrs/demopos/.agent/PARTE_2_VENTAS_2_MESES.sql
   ```

3. **Pegar y presionar "Run"**

4. **Esperar a que termine** (puede mostrar "Running..." por varios minutos)

5. **Verificar resultado final:**
   ```
   ┌─────────────────────┬───────────┬─────────────┐
   │       tabla         │ registros │ stock_total │
   ├─────────────────────┼───────────┼─────────────┤
   │ INVENTARIO          │    75     │   ~4,500    │
   │ VENTAS              │  ~1,800   │ ~$450,000   │
   │ ITEMS VENDIDOS      │  ~6,500   │   ~8,000    │
   │ REABASTECIMIENTOS   │     9     │  ~$35,000   │
   │ PRODUCTOS CADUCIDAD │    15     │     ~150    │
   │ SUGERENCIAS REORDEN │    10+    │     ~300    │
   └─────────────────────┴───────────┴─────────────┘
   ```

---

## 🎨 **Productos Generados (75 items)**

### Por Categoría:

- 🥤 **Bebidas** (10): Coca-Cola, Pepsi, Agua, Jugos, Monster, Sprite, etc.
- 🥛 **Lácteos** (8): Leche, Huevos, Yogurt, Quesos, Crema, Mantequilla
- 🍞 **Panadería** (6): Pan Bimbo, Tortillas, Bolillos, Gansito
- 🍟 **Botanas** (12): Sabritas, Doritos, Takis, Oreo, M&Ms, Galletas
- 🍚 **Despensa** (15): Arroz, Frijol, Aceite, Azúcar, Pasta, Café, Atún
- 🥫 **Enlatados** (8): Frijoles, Chiles, Elote, Salsas, Sardina
- 🧴 **Higiene** (10): Jabones, Shampoo, Papel higiénico, Cloro, Pañales
- 🥓 **Carnes Frías** (6): Jamón, Salchicha, Tocino, Queso Americano

**Todos los productos incluyen:**
- ✅ Nombre, SKU y código de barras
- ✅ Precio de venta y costo
- ✅ URL de imagen (placeholder o generada)
- ✅ Stock mínimo y seguimiento

---

## 📈 **Datos Generados (2 Meses)**

### **Ventas Realistas:**
- 📅 **60 días** de operación (2 meses completos)
- 📊 **15-45 ventas/día** (más en fines de semana)
- 💰 **$250,000 - $500,000** en ventas totales
- 🛒 **1-8 productos** por venta
- 💳 **60% efectivo, 25% tarjeta, 15% transferencia**

### **Clientes:**
- 👥 **30 clientes** registrados con datos realistas
- 📧 Email, teléfono y dirección
- 📅 Registrados en diferentes fechas de los 2 meses

### **Inventario:**
- 📦 Stock inicial realista por tipo de producto
- 📉 Decrementos automáticos con cada venta
- 📈 Reabastecimientos semanales (9 entregas)
- ⚠️ Productos con stock bajo detectados

### **Caducidad:**
- ⏰ **15 productos perecederos** registrados
- 🔴 Algunos urgentes (2 días)
- 🟡 Otros próximos (7 días)
- 🟢 Algunos normales (15 días)

### **Reorden:**
- 🎯 **10+ sugerencias** activas
- 🔴 Urgentes: Stock < mínimo
- 🟡 Altas: Stock cercano a mínimo
- 🟢 Normales: Reorden preventivo

---

## 🚀 **Después de Ejecutar**

### **Recarga el Dashboard:**
```
http://localhost:3000/dashboard
o
https://aura-pos-fawn.vercel.app/dashboard
```

Deberías ver:

1. **Widget de Reabastecimiento** con sugerencias reales
2. **Alertas de Caducidad** con productos próximos a vencer
3. **Inventario** poblado con 75 productos
4. **Historial de Ventas** de 2 meses

### **Explorar Secciones:**

#### **📦 Inventario:**
```
/inventory
```
- Ver 75 productos con stock
- Vista de cards en móvil ✅
- Filtros funcionando

#### **💰 Ventas:**
```
/sales
```
- Ver ~1,800 ventas históricas
- Reportes por día/semana/mes

#### **👥 Clientes:**
```
/customers
```
- Ver 30 clientes registrados
- Historial de compras por cliente

#### **📊 Reportes:**
```
/reports
```
- Gráficas de ventas diarias
- Top productos vendidos
- Análisis de tendencias

---

## ⚡ **Notas de Performance**

- El Paso 1 tarda **~1 minuto**
- El Paso 2 tarda **~10-15 minutos** (genera ventas día por día)
- Total: **~15-20 minutos** para completar

---

## 🐛 **Troubleshooting**

### **Error: "duplicate key value"**
**Solución:** Ya tienes datos. Puedes:
1. Eliminar datos existentes:
   ```sql
   DELETE FROM sale_items;
   DELETE FROM sales;
   DELETE FROM inventory;
   DELETE FROM products;
   DELETE FROM categories;
   DELETE FROM customers;
   ```
2. Volver a ejecutar ambos scripts

### **Error: "timeout"**
**Solución:** El script Parte 2 es largo. Si da timeout:
1. Reduce el número de días en la función:
   ```sql
   SELECT generate_daily_sales(30, 10, 30);  -- 30 días en lugar de 60
   ```

### **No aparecen productos en dashboard**
**Solución:**
1. Verifica que haya productos:
   ```sql
   SELECT COUNT(*) FROM products WHERE is_active = true;
   ```
2. Verifica que haya inventario:
   ```sql
   SELECT COUNT(*) FROM inventory;
   ```

---

## 📸 **Imágenes de Productos**

Las imágenes son placeholders generados con:
- `https://placehold.co/400x400/COLOR/white?text=NOMBRE`

Para agregar imágenes reales:
1. Sube imágenes a Supabase Storage bucket `product-images`
2. Actualiza la columna `image_url` en la tabla `products`

---

## ✅ **Checklist Final**

- [ ] Ejecutar `POBLAR_BD_2_MESES.sql` (Paso 1)
- [ ] Verificar: 75 productos + 30 clientes
- [ ] Ejecutar `PARTE_2_VENTAS_2_MESES.sql` (Paso 2)
- [ ] Esperar 10-15 min
- [ ] Verificar: ~1,800 ventas generadas
- [ ] Recargar dashboard
- [ ] Verificar widgets funcionando
- [ ] Explorar inventario, ventas, reportes

---

## 🎉 **¡Listo!**

Tu base de datos ahora tiene **2 meses completos de operación** con datos realistas de una tienda de abarrotes mexicana.

**Generado:** $(date)  
**Por:** Antigravity Agent
