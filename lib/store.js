// ==================================================================
//  VsShop — configuración central de la tienda
//  ------------------------------------------------------------------
//  Nombre genérico a propósito: se rotan "productos ganadores" según
//  la temporada. Para lanzar una temporada nueva normalmente solo
//  tocas:
//    1) STORE (textos de marca y de la portada)
//    2) PRODUCTS (el catálogo)
//    3) --accent en styles/globals.css (color de la temporada)
//  Todo lo demás se recalcula solo (precios, descuentos, totales).
// ==================================================================

// ---------- Marca / textos de la portada --------------------------
export const STORE = {
  name: 'VsShop',
  currency: 'CLP',
  currencySymbol: '$',

  // Cinta negra superior que se mueve en loop hacia la izquierda.
  // Agrega o quita frases libremente.
  marquee: [
    'ENVÍO A TODO CHILE',
    'PAGO SEGURO',
    'COMPATIBLE CON AIRTAG',
    'STOCK LIMITADO',
    'DESPACHO RÁPIDO',
  ],

  // Hero principal.
  hero: {
    eyebrow: 'VSSHOP · COLLARES CON AIRTAG',
    // El titular va en dos partes: la segunda se pinta con el color de acento.
    titleLine1: 'SIEMPRE SABRÁS',
    titleLine2: 'DÓNDE ESTÁ.',
    description:
      'Collar ajustable con funda de silicona para AirTag. Tu perro cómodo, tú tranquilo. Despacho a todo Chile y pago seguro.',
    ctaLabel: 'VER COLLARES',
    ctaHref: '#coleccion',
  },

  // Bloque destacado (imagen grande con etiquetas encima).
  feature: {
    badge: 'DESTACADO',
    caption: 'COLLAR AIRTAG · NEGRO',
    image: '/images/collar-airtag-negro.webp',
  },

  // Fila de datos rápidos bajo el hero.
  stats: [
    { label: 'Despacho', value: 'A todo Chile' },
    { label: 'Pago', value: 'Mercado Pago' },
    { label: 'Talla', value: 'Ajustable' },
  ],

  // Sección de "la colección".
  collection: {
    eyebrow: 'ELIGE SU COLOR',
    title: 'EMPIEZA AQUÍ.',
    description: 'Nylon resistente, funda de silicona y hebilla de cierre rápido. AirTag no incluido.',
  },

  // Sección de marca.
  label: {
    eyebrow: 'LA TIENDA',
    title: 'POCOS PRODUCTOS. BIEN ELEGIDOS.',
    description:
      'VsShop trae cada temporada una selección corta de productos probados. Menos ruido, mejores compras.',
    highlights: [
      { big: 'CHILE', small: 'DESPACHO NACIONAL' },
      { big: 'SEGURO', small: 'PAGO CON MERCADO PAGO' },
      { big: 'LIMITADO', small: 'CADA TEMPORADA' },
    ],
  },

  // Barra inferior fija.
  bottomBar: {
    text: '¿QUIERES NOVEDADES?',
    ctaLabel: 'VER LA COLECCIÓN',
    ctaHref: '#coleccion',
  },
};

// ==================================================================
//  CATÁLOGO
//  ------------------------------------------------------------------
//  Vacío por ahora. Cuando lleguen las fotos, agrega objetos con esta
//  forma. El id debe ser único y estable (se usa en el carrito, en
//  Mercado Pago y en el Meta Pixel).
//
//  {
//    id: 'nombre-corto-unico',
//    name: 'Nombre del producto',
//    tagline: 'Frase corta de venta',
//    price: 13990,            // precio real de venta (CLP, entero)
//    compareAtPrice: 19990,   // precio tachado (opcional; solo visual)
//    image: '/images/mi-foto.png',
//    images: ['/images/mi-foto.png'], // opcional: galería
//    status: 'available',     // 'available' | 'preorder' | 'soldout'
//  }
// ==================================================================
// ⚠️ PRECIOS DE EJEMPLO — confírmalos antes de publicar.
// El primero se muestra primero en la grilla (el negro es el destacado).
export const PRODUCTS = [
  {
    id: 'collar-airtag-negro',
    name: 'Collar AirTag Negro',
    tagline: 'Funda de silicona + nylon ajustable. AirTag no incluido.',
    price: 12990,
    compareAtPrice: 19990,
    image: '/images/collar-airtag-negro.webp',
    status: 'available',
  },
  {
    id: 'collar-airtag-rosado',
    name: 'Collar AirTag Rosado',
    tagline: 'Funda de silicona + nylon ajustable. AirTag no incluido.',
    price: 12990,
    compareAtPrice: 19990,
    image: '/images/collar-airtag-rosado.webp',
    status: 'available',
  },
];

// Cuántas tarjetas "placeholder" mostrar mientras no hay productos.
export const PLACEHOLDER_SLOTS = 4;

// ---------- Helpers -----------------------------------------------
export const REGIONES_CHILE = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  "Libertador General Bernardo O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes y de la Antártica Chilena',
];

export function formatCLP(value) {
  return Number(value || 0).toLocaleString('es-CL');
}

export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

// % de descuento de un producto (nunca hardcodeado).
export function discountPercent(product) {
  if (!product) return 0;
  const { compareAtPrice, price } = product;
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round((1 - price / compareAtPrice) * 100);
}

// Un producto es comprable solo si está disponible o en preventa.
export function isBuyable(product) {
  return Boolean(product) && product.status !== 'soldout';
}

// ------------------------------------------------------------------
//  buildOrder — ÚNICA fuente de verdad del total.
//  cart = { [productId]: cantidad }
//  La usan por igual la UI (resumen + Meta Pixel) y el servidor
//  (/api/create-preference, que la vuelve a calcular y NUNCA confía
//  en montos que vengan del cliente).
// ------------------------------------------------------------------
export function buildOrder(cart = {}) {
  const lines = [];

  for (const product of PRODUCTS) {
    const qty = Math.max(0, parseInt(cart[product.id], 10) || 0);
    if (qty > 0 && isBuyable(product)) {
      lines.push({
        id: product.id,
        name: product.name,
        image: product.image || '',
        quantity: qty,
        unitPrice: product.price,
        subtotal: product.price * qty,
      });
    }
  }

  const totalUnits = lines.reduce((n, l) => n + l.quantity, 0);
  const total = lines.reduce((n, l) => n + l.subtotal, 0);

  return { lines, totalUnits, total };
}
