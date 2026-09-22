# VsShop

Tienda online genérica (mobile-first) construida con **Next.js + Tailwind**.
Nombre genérico a propósito: cada temporada se rotan los "productos
ganadores". Reutiliza el **portal de pago Mercado Pago** y el **Meta Pixel**
del proyecto original.

## Arrancar en tu PC

```bash
npm install
# crea tu .env.local a partir del ejemplo:
#   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
#   NEXT_PUBLIC_META_PIXEL_ID=...
npm run dev        # http://localhost:3000
```

Build de producción: `npm run build && npm start`.

## Cómo lanzar una temporada nueva

Casi todo se controla desde **`lib/store.js`**:

1. **Textos de la portada** → objeto `STORE` (marquee, hero, stats, marca…).
2. **Productos** → array `PRODUCTS`. Está **vacío** a propósito. Agrega objetos así:

   ```js
   {
     id: 'nombre-corto-unico',   // único y estable (se usa en carrito, MP y Pixel)
     name: 'Nombre del producto',
     tagline: 'Frase corta',
     price: 13990,               // precio real (CLP, entero) — fuente de verdad
     compareAtPrice: 19990,      // precio tachado (opcional, solo visual)
     image: '/images/mi-foto.png',
     status: 'available',        // 'available' | 'preorder' | 'soldout'
   }
   ```

   Pon las fotos en `public/images/`. En cuanto haya productos, las tarjetas
   "placeholder" de la portada se reemplazan solas por los productos reales.

3. **Color de la temporada** → variable `--accent` en `styles/globals.css`.

## Estructura

```
lib/store.js      → config de marca + catálogo + buildOrder (total = fuente de verdad)
lib/cart.js       → estado del carrito (Context)
lib/fpixel.js     → Meta Pixel (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase)
pages/index.js    → landing (hero, destacado, colección, marca)
pages/api/create-preference.js → crea la preferencia de Mercado Pago (server-side, seguro)
pages/gracias.js, pago-fallido.js, pago-pendiente.js → retornos de pago
components/        → Marquee, Header, ProductCard, CartDrawer, BottomBar, Layout
```

## Seguridad del pago

El total y los ítems **se recalculan en el servidor** (`buildOrder`), nunca se
confía en montos que vengan del navegador. El `MERCADOPAGO_ACCESS_TOKEN` vive
solo en variables de entorno (nunca en el código del cliente).
