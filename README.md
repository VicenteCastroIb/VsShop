# VsShop

Tienda online genérica (mobile-first) construida con **Next.js + Tailwind**.
Nombre genérico a propósito: cada temporada se rotan los "productos
ganadores". Incluye **portal de pago Mercado Pago** y **Meta Pixel**.

Temporada actual: **joyas** (tema negro elegante con acento dorado).

## Arrancar en tu PC

```bash
npm install
# crea tu .env.local a partir de .env.example:
#   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
#   NEXT_PUBLIC_META_PIXEL_ID=...
npm run dev        # http://localhost:3000
```

Build de producción: `npm run build && npm start`.

## ¿Está activo el portal de pago?

Abre `/api/health` en el navegador:

- `{"ok":true,"pago":true}` → el token de Mercado Pago está configurado.
- `"pago":false` → falta `MERCADOPAGO_ACCESS_TOKEN` en Vercel
  (Settings → Environment Variables) y hay que volver a desplegar.

## Qué se edita en cada temporada

Casi todo vive en **`lib/store.js`**:

1. **`STORE`** → nombre, barra superior, **WhatsApp** (`whatsapp: '569...'`),
   garantía, tabla comparativa y prueba social.
2. **`PRODUCTS`** → un objeto por producto: precio, precio tachado, packs
   ("Compra 2"), colores, grabado, extras con descuento, fotos y todos los
   textos de su página (beneficios, acordeones, preguntas, historia).
3. **Colores** → `tailwind.config.js` (`night`, `surface`, `gold`…) y las
   mismas variables en `styles/globals.css`.

Fotos: cuadradas, `.webp`, en `public/images/`.

### Reseñas y fotos de clientes

`STORE.social` parte vacío a propósito: las estrellas, las reseñas y la
galería de clientes **solo aparecen cuando agregas datos reales** ahí.

## Estructura

```
lib/store.js      → marca + catálogo + buildOrder (total = fuente de verdad)
lib/cart.js       → carrito (packs, opciones por unidad, extras)
lib/fpixel.js     → Meta Pixel (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase)
pages/index.js            → inicio: carrusel "Nuestros Productos"
pages/producto/[id].js    → página de producto
pages/api/create-preference.js → crea el pago en Mercado Pago (servidor)
pages/api/health.js       → chequeo del portal de pago
pages/gracias.js, pago-fallido.js, pago-pendiente.js → retornos de pago
components/               → Header (menú + buscador), CartDrawer, ProductCard, ProductCarousel…
components/product/       → Gallery, BuyBox, Sections, StickyBuyBar
```

## Seguridad del pago

- El total, los packs y los extras **se recalculan en el servidor**
  (`buildOrder`); nunca se confía en precios que vengan del navegador.
- Cantidades con tope, ids desconocidos ignorados, datos del comprador y
  texto de grabado validados y acotados en el servidor.
- `MERCADOPAGO_ACCESS_TOKEN` vive solo en variables de entorno; los errores
  de Mercado Pago quedan en los logs del servidor, no se muestran al cliente.
- Cabeceras de seguridad en `next.config.js`.
