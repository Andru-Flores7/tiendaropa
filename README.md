# Alma — Tienda de ropa (React + Vite + Supabase)

Tienda online simple con panel de administración. Frontend en React (Vite),
CSS puro con animaciones suaves, y Supabase como backend (base de datos,
autenticación y almacenamiento de imágenes).

## Estructura del proyecto

```
src/
  lib/supabase.js        cliente de Supabase
  context/                Auth, Carrito (persistido en localStorage), Toasts
  hooks/useProducts.js    lectura de productos y categorías
  components/             Navbar, Footer, ProductCard, CartDrawer, AdminLayout...
  pages/                  Home, Shop, ProductDetail, Checkout, OrderConfirmation
  pages/admin/            Login, Dashboard, Products, Categories, Orders
supabase/schema.sql       esquema completo: tablas, RLS, storage, triggers
```

## 1. Configura Supabase

1. Crea un proyecto en https://supabase.com
2. Abre el **SQL Editor** y ejecuta todo el contenido de `supabase/schema.sql`
   (crea tablas, políticas de seguridad, el bucket de imágenes y datos de ejemplo).
3. En **Authentication → Providers**, deja activado el login por email/contraseña.
4. Crea tu usuario administrador:
   - Regístralo desde la propia app (o desde Authentication → Users → Add user).
   - En el SQL Editor, ejecuta (con tu email real):
     ```sql
     update public.profiles set is_admin = true
     where id = (select id from auth.users where email = 'tu@email.com');
     ```
5. En **Project Settings → API**, copia la `URL` y la `anon public key`.

## 2. Configura el proyecto

```bash
cp .env.example .env
```

Edita `.env` con tus datos:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

## 3. Instala y ejecuta

```bash
npm install
npm run dev
```

- Tienda pública: `http://localhost:5173/`
- Panel admin: `http://localhost:5173/admin/login`

## 4. Producción

```bash
npm run build
npm run preview   # para probar el build localmente
```

Sube la carpeta `dist/` a Vercel, Netlify, Cloudflare Pages, etc.

## Funcionalidad incluida

**Tienda pública**
- Catálogo con filtro por categoría, ficha de producto (tallas, colores, galería)
- Carrito persistente (localStorage) con panel deslizante
- Checkout que crea el pedido directamente en Supabase (sin pasarela de pago)

**Panel de administración** (`/admin`, protegido por login + rol `is_admin`)
- Resumen con estadísticas (productos, pedidos, ingresos)
- CRUD de productos (con subida de imagen a Supabase Storage)
- CRUD de categorías
- Gestión de pedidos: ver detalle y cambiar estado (pendiente/pagado/enviado/entregado/cancelado)

## Notas técnicas

- Todo el control de acceso al panel se hace con **Row Level Security** en
  Supabase (tabla `profiles.is_admin`), no solo en el frontend — así que
  aunque alguien inspeccione el código, no puede escribir en la base de datos
  sin ser admin.
- El build usa `manualChunks` en `vite.config.js` para separar `vendor` y
  `supabase` del bundle principal y acelerar la carga.
- Estilos 100% CSS puro (sin frameworks), con variables de diseño en
  `src/index.css` y animaciones que respetan `prefers-reduced-motion`.
