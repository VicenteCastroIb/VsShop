// ==================================================================
//  VsShop — configuración central de la tienda
//  ------------------------------------------------------------------
//  Nombre genérico a propósito: se rotan "productos ganadores" según
//  la temporada. Para lanzar una temporada nueva normalmente solo
//  tocas:
//    1) STORE     (marca, textos generales, WhatsApp, garantía)
//    2) PRODUCTS  (catálogo: precios, packs, textos de cada página)
//    3) Colores   (styles/globals.css + tailwind.config.js)
//  Todo lo demás se recalcula solo (descuentos, packs, totales).
// ==================================================================

export const STORE = {
  name: 'VsShop',
  tagline: 'Joyas & Accesorios',
  currency: 'CLP',
  currencySymbol: '$',

  // Barra superior fija.
  announcement: 'Envío a Todo Chile',

  // WhatsApp de atención, solo dígitos con código de país (ej: '56912345678').
  // Si está vacío, el botón flotante y el link de contacto no se muestran.
  whatsapp: '',
  whatsappMessage: 'Hola, tengo una consulta sobre un producto de la tienda.',

  home: {
    title: 'Nuestros Productos',
  },

  // Texto del acordeón "Envíos & Procesamiento" (igual para todos los productos).
  shipping:
    'Despachamos a todo Chile. Apenas se confirma tu pago preparamos tu pedido y te contactamos al teléfono que dejaste para coordinar la entrega.',

  // Sección de garantía (página de producto).
  guarantee: {
    days: 30,
    title: '30 Días de Garantía',
    paragraphs: [
      'Queremos que compres con tranquilidad. Si tu joya llega con una falla de fábrica o se daña durante el envío, escríbenos y lo resolvemos.',
      'Revisamos cada pieza antes de despacharla para que llegue tal como la ves en las fotos.',
      'Si tienes cualquier problema con tu pedido, nuestro equipo te ayuda a solucionarlo.',
    ],
  },

  // Tabla comparativa (página de producto).
  comparison: {
    title: 'La diferencia está en los detalles',
    usLabel: 'VsShop',
    themLabel: 'Bisutería común',
  },

  // ----------------------------------------------------------------
  //  PRUEBA SOCIAL — SOLO DATOS REALES.
  //  Mientras estén vacíos, las secciones de reseñas, la línea de
  //  estrellas y la galería de clientes NO se muestran. Cuando tengas
  //  reseñas y fotos reales de tus clientes, agrégalas aquí.
  // ----------------------------------------------------------------
  social: {
    rating: null, // ej: 4.8
    ratingLabel: '', // ej: 'por 120 clientes'
    title: 'Clientes Felices',
    // { title: 'Me encantó', text: '...', author: 'Nombre', productId: 'collar-girasol-giratorio' }
    reviews: [],
    // Fotos reales enviadas por clientes: '/images/cliente-1.webp'
    photos: [],
  },
};

// ==================================================================
//  CATÁLOGO
//  ------------------------------------------------------------------
//  ⚠️ PRECIOS DE EJEMPLO — confírmalos antes de publicar.
//
//  id              único y estable (carrito, Mercado Pago, Meta Pixel, URL)
//  price           precio real de 1 unidad (CLP, entero)
//  compareAtPrice  precio tachado (solo visual)
//  packs           precio TOTAL por llevar N unidades ("Compra más y ahorra")
//  colors          opciones del selector por unidad
//  personalize     null, o { label, placeholder, maxLength, help } si lleva grabado
//  addonPrice      precio cuando se agrega como extra desde otra página
//  addons          ids de productos que se ofrecen como extra con descuento
//  images          galería (la primera es la principal)
// ==================================================================
export const PRODUCTS = [
  {
    id: 'collar-girasol-giratorio',
    name: 'Collar Girasol Giratorio',
    price: 21990,
    compareAtPrice: 32990,
    packs: [{ qty: 2, price: 34990, popular: true }],
    colors: ['Dorado'],
    personalize: null,
    addonPrice: 17990,
    addons: ['collar-relicario-mariposa'],
    image: '/images/collar-girasol.webp',
    images: ['/images/collar-girasol.webp', '/images/collar-girasol-detalle.webp'],
    status: 'available',
    bullets: [
      { icon: '🎁', text: 'Un regalo que sorprende' },
      { icon: '💎', text: 'Acero con baño de oro 18K' },
      { icon: '🌻', text: 'Centro giratorio antiestrés' },
      { icon: '✨', text: 'Liviano y cómodo para todos los días' },
    ],
    details: [
      {
        icon: 'help',
        title: '¿Qué Incluye?',
        body: '1 collar girasol giratorio con su cadena.',
      },
      {
        icon: 'star',
        title: 'Materiales & Calidad',
        body: 'Acero inoxidable 316L hipoalergénico con baño de oro 18K y cristales de circonia. Resiste el uso diario sin perder el brillo.',
      },
    ],
    faq: [
      {
        q: '¿El collar se pone negro o pierde el color?',
        a: 'No. Está hecho en **acero inoxidable 316L**, un material muy resistente a la oxidación, con **baño de oro 18K** que mantiene su brillo con el uso normal.',
      },
      {
        q: '¿Puede dar alergia?',
        a: 'El **acero 316L es hipoalergénico** y amable con la piel, por eso es de los materiales más usados en joyería para piel sensible.',
      },
      {
        q: '¿El girasol gira de verdad?',
        a: 'Sí. El centro tiene un **mecanismo giratorio suave** que mueves con los dedos. Muchas personas lo usan como un pequeño **antiestrés** durante el día.',
      },
      {
        q: '¿Sirve para regalar?',
        a: 'Es uno de los más pedidos para regalo: cumpleaños, aniversarios o simplemente para tener un detalle con alguien especial.',
      },
    ],
    story: {
      title: 'El regalo perfecto para sorprender a quien amas',
      paragraphs: [
        'Un buen regalo es el que tiene algo que decir.',
        'El girasol siempre busca la luz: representa alegría, cariño y lealtad. Por eso es uno de los símbolos favoritos para regalar.',
        'El centro gira suavemente entre los dedos, un detalle distinto que lo hace único.',
        'Elegante, con significado y fácil de combinar con cualquier look.',
      ],
      image: '/images/collar-girasol-detalle.webp',
    },
    compare: ['Diseño giratorio', 'Baño de oro 18K', 'Acero 316L'],
  },
  {
    id: 'collar-relicario-mariposa',
    name: 'Collar Relicario de Mariposa',
    price: 24990,
    compareAtPrice: 34990,
    packs: [{ qty: 2, price: 39990, popular: true }],
    colors: ['Dorado'],
    personalize: null,
    addonPrice: 19990,
    addons: ['collar-girasol-giratorio'],
    image: '/images/collar-mariposa.webp',
    images: ['/images/collar-mariposa.webp', '/images/collar-mariposa-detalle.webp'],
    status: 'available',
    bullets: [
      { icon: '🦋', text: 'Relicario que se abre' },
      { icon: '💎', text: 'Acero con baño de oro 18K' },
      { icon: '🤍', text: 'Centro nacarado con mariposa en relieve' },
      { icon: '🎁', text: 'Un regalo con significado' },
    ],
    details: [
      {
        icon: 'help',
        title: '¿Qué Incluye?',
        body: '1 collar relicario de mariposa con su cadena.',
      },
      {
        icon: 'star',
        title: 'Materiales & Calidad',
        body: 'Acero inoxidable 316L hipoalergénico con baño de oro 18K. Medallón ovalado con centro nacarado y mariposa en relieve.',
      },
    ],
    faq: [
      {
        q: '¿El relicario se abre?',
        a: 'Sí. El medallón **se abre por el costado** y por dentro puedes guardar una foto pequeña o un recuerdo.',
      },
      {
        q: '¿Se pone negro o pierde el color?',
        a: 'No. Es **acero inoxidable 316L con baño de oro 18K**, resistente a la oxidación con el uso normal.',
      },
      {
        q: '¿Puede dar alergia?',
        a: 'El **acero 316L es hipoalergénico**, pensado para usarse a diario incluso en piel sensible.',
      },
      {
        q: '¿Qué significa la mariposa?',
        a: 'La mariposa simboliza **cambio, libertad y nuevos comienzos**. Por eso es un regalo muy elegido para momentos importantes.',
      },
    ],
    story: {
      title: 'Un recuerdo que va siempre contigo',
      paragraphs: [
        'Hay cosas que queremos tener cerca todos los días.',
        'Este relicario guarda por dentro esa foto o ese recuerdo que solo tú conoces.',
        'Por fuera, una mariposa en relieve sobre un centro nacarado que brilla distinto con cada luz.',
        'Delicado, atemporal y con una historia propia.',
      ],
      image: '/images/collar-mariposa-detalle.webp',
    },
    compare: ['Relicario que se abre', 'Baño de oro 18K', 'Acero 316L'],
  },
  {
    id: 'collar-sobre-grabado-foto',
    name: 'Collar Sobre Grabado con Foto',
    price: 24990,
    compareAtPrice: 32990,
    packs: [{ qty: 2, price: 39990, popular: true }],
    colors: ['Dorado'],
    personalize: {
      label: 'Texto a grabar',
      placeholder: 'Ej: I love you',
      maxLength: 20,
      help: 'Después de tu compra te escribimos para que nos envíes la foto.',
    },
    addonPrice: null,
    addons: ['collar-girasol-giratorio', 'collar-relicario-mariposa'],
    image: '/images/collar-sobre.webp',
    images: ['/images/collar-sobre.webp', '/images/collar-sobre-detalle.webp'],
    status: 'available',
    bullets: [
      { icon: '💌', text: 'Sobre que se desliza y muestra tu foto' },
      { icon: '✍️', text: 'Grabado con el texto que tú elijas' },
      { icon: '💎', text: 'Acero con baño de oro 18K' },
      { icon: '🎁', text: 'Un regalo único e irrepetible' },
    ],
    details: [
      {
        icon: 'help',
        title: '¿Qué Incluye?',
        body: '1 collar con dije de sobre, grabado con tu texto y con tu foto en la lámina interior.',
      },
      {
        icon: 'star',
        title: 'Materiales & Calidad',
        body: 'Acero inoxidable 316L hipoalergénico con baño de oro 18K. Grabado permanente y foto impresa en la lámina deslizable.',
      },
    ],
    faq: [
      {
        q: '¿Cómo envío mi foto y mi texto?',
        a: 'El **texto lo escribes aquí** antes de comprar. La **foto nos la envías después del pago**: te contactamos al teléfono que dejes en la compra.',
      },
      {
        q: '¿Qué foto sirve?',
        a: 'Cualquier foto **nítida y con buena luz**. Mientras más cerca estén los rostros, mejor se ve en el dije.',
      },
      {
        q: '¿El grabado se borra?',
        a: 'No. El grabado es **permanente** sobre el acero, no es un sticker ni una impresión superficial.',
      },
      {
        q: '¿Se pone negro o pierde el color?',
        a: 'No. Es **acero inoxidable 316L con baño de oro 18K**, resistente a la oxidación con el uso normal.',
      },
    ],
    story: {
      title: 'Una carta que se lleva puesta',
      paragraphs: [
        'Las mejores cartas son las que se guardan para siempre.',
        'Por fuera, las palabras que tú elijas. Por dentro, la foto de ese momento que no quieres olvidar.',
        'El sobre se desliza y la revela, como abrir una carta por primera vez.',
        'Un regalo hecho solo para una persona.',
      ],
      image: '/images/collar-sobre-detalle.webp',
    },
    compare: ['Grabado personalizado', 'Tu foto en el interior', 'Acero 316L'],
  },
  {
    id: 'pulsera-personalizada',
    name: 'Pulsera Personalizada',
    price: 19990,
    compareAtPrice: 29990,
    packs: [{ qty: 2, price: 31990, popular: true }],
    colors: ['Plateado'],
    personalize: {
      label: 'Texto a grabar',
      placeholder: 'Ej: un nombre o una fecha',
      maxLength: 20,
      help: 'Revisa bien el texto: se graba tal como lo escribas.',
    },
    addonPrice: null,
    addons: ['collar-girasol-giratorio', 'collar-relicario-mariposa'],
    image: '/images/pulsera-personalizada.webp',
    images: ['/images/pulsera-personalizada.webp', '/images/pulsera-personalizada-detalle.webp'],
    status: 'available',
    bullets: [
      { icon: '✍️', text: 'Grabada con el nombre o fecha que elijas' },
      { icon: '🤍', text: 'Placa con corazón calado' },
      { icon: '💎', text: 'Acero inoxidable 316L' },
      { icon: '🎁', text: 'Largo ajustable, calza en cualquier muñeca' },
    ],
    details: [
      {
        icon: 'help',
        title: '¿Qué Incluye?',
        body: '1 pulsera con placa grabada con tu texto y cadena con extensión ajustable.',
      },
      {
        icon: 'star',
        title: 'Materiales & Calidad',
        body: 'Acero inoxidable 316L hipoalergénico. Grabado permanente y cierre de mosquetón.',
      },
    ],
    faq: [
      {
        q: '¿Qué puedo grabar?',
        a: 'Un **nombre, una fecha o una palabra corta** de hasta 20 caracteres. Lo escribes aquí antes de comprar.',
      },
      {
        q: '¿El grabado se borra?',
        a: 'No. El grabado es **permanente** sobre el acero.',
      },
      {
        q: '¿Qué talla es?',
        a: 'Tiene **cadena de extensión**, así que se ajusta a la mayoría de las muñecas.',
      },
      {
        q: '¿Se oxida con el agua?',
        a: 'El **acero inoxidable 316L** es resistente a la oxidación con el uso diario.',
      },
    ],
    story: {
      title: 'Un nombre, una fecha, una promesa',
      paragraphs: [
        'Algunas palabras merecen quedar grabadas.',
        'Una placa minimalista con un corazón calado y el texto que tú elijas.',
        'Liviana y discreta, para usarla todos los días.',
        'Un detalle simple que dice mucho.',
      ],
      image: '/images/pulsera-personalizada-detalle.webp',
    },
    compare: ['Grabado personalizado', 'Largo ajustable', 'Acero 316L'],
  },
];

// ---------- Límites (los aplica también el servidor) --------------
export const MAX_QTY = 10;

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

// ---------- Helpers -----------------------------------------------
export function formatCLP(value) {
  return Number(value || 0).toLocaleString('es-CL');
}

export function money(value) {
  return `${STORE.currencySymbol}${formatCLP(value)}`;
}

export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function productHref(product) {
  return `/producto/${product.id}`;
}

// % de descuento de un producto (nunca hardcodeado).
export function discountPercent(product) {
  if (!product) return 0;
  const { compareAtPrice, price } = product;
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round((1 - price / compareAtPrice) * 100);
}

// Un producto es comprable solo si no está agotado.
export function isBuyable(product) {
  return Boolean(product) && product.status !== 'soldout';
}

export function whatsappUrl(message = STORE.whatsappMessage) {
  const number = String(STORE.whatsapp || '').replace(/\D/g, '');
  if (!number) return '';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function clampInt(value, min, max) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

// Opciones de "Compra más y ahorra": 1 unidad + los packs definidos.
export function getPacks(product) {
  const compare = product.compareAtPrice || product.price;
  const tiers = [{ qty: 1, price: product.price, popular: false }]
    .concat(product.packs || [])
    .filter((p) => p.qty >= 1 && p.qty <= MAX_QTY)
    .sort((a, b) => a.qty - b.qty);
  return tiers.map((p) => ({
    qty: p.qty,
    price: p.price,
    popular: Boolean(p.popular),
    compareAt: compare * p.qty,
    saving: Math.max(0, compare * p.qty - p.price),
  }));
}

// Precio TOTAL de `qty` unidades aplicando los packs más convenientes.
export function priceForQty(product, qty) {
  const packs = getPacks(product).sort((a, b) => b.qty - a.qty);
  let rest = qty;
  let total = 0;
  for (const pack of packs) {
    const n = Math.floor(rest / pack.qty);
    total += n * pack.price;
    rest -= n * pack.qty;
  }
  return total;
}

// Caracteres permitidos en un grabado: letras, números y unos pocos signos.
// Se usa mientras la persona escribe (ve exactamente lo que se grabará).
export function filterEngraving(text, maxLength) {
  return String(text == null ? '' : text)
    .replace(/[^\p{L}\p{N} .,'&+!?♥❤-]/gu, '')
    .replace(/ {2,}/g, ' ')
    .slice(0, maxLength);
}

// Versión final (la que valida también el servidor): además recorta espacios.
export function cleanEngraving(text, maxLength) {
  return filterEngraving(text, maxLength * 4).trim().slice(0, maxLength);
}

// Una entrada por unidad: { color, text }. Siempre válida para el producto.
export function normalizeUnits(product, units, qty) {
  const list = Array.isArray(units) ? units : [];
  const colors = product.colors && product.colors.length ? product.colors : [''];
  return Array.from({ length: qty }, (_, i) => {
    const raw = list[i] && typeof list[i] === 'object' ? list[i] : {};
    const color = colors.includes(raw.color) ? raw.color : colors[0];
    const text = product.personalize
      ? cleanEngraving(raw.text, product.personalize.maxLength)
      : '';
    return { color, text };
  });
}

// ------------------------------------------------------------------
//  buildOrder — ÚNICA fuente de verdad del total.
//  cart = {
//    lines:  { [productId]: { qty, units: [{ color, text }] } },
//    addons: [productId, ...]   // extras con descuento (1 de cada uno)
//  }
//  La usan por igual la UI y el servidor (/api/create-preference, que
//  la vuelve a calcular y NUNCA confía en montos que vengan del cliente).
// ------------------------------------------------------------------
export function buildOrder(cart) {
  const safe = cart && typeof cart === 'object' ? cart : {};
  const rawLines = safe.lines && typeof safe.lines === 'object' ? safe.lines : {};
  const rawAddons = Array.isArray(safe.addons) ? safe.addons : [];
  const lines = [];
  const offered = new Set();

  for (const product of PRODUCTS) {
    if (!Object.prototype.hasOwnProperty.call(rawLines, product.id)) continue;
    const raw = rawLines[product.id];
    const qty = clampInt(raw && raw.qty, 0, MAX_QTY);
    if (qty <= 0 || !isBuyable(product)) continue;

    const subtotal = priceForQty(product, qty);
    lines.push({
      key: product.id,
      id: product.id,
      kind: 'main',
      name: product.name,
      image: product.image || '',
      quantity: qty,
      subtotal,
      regular: product.price * qty,
      units: normalizeUnits(product, raw && raw.units, qty),
      personalized: Boolean(product.personalize),
    });
    (product.addons || []).forEach((id) => offered.add(id));
  }

  // Un extra solo vale si algún producto del carrito lo ofrece.
  for (const product of PRODUCTS) {
    if (!rawAddons.includes(product.id)) continue;
    if (!offered.has(product.id) || !product.addonPrice || !isBuyable(product)) continue;
    lines.push({
      key: `${product.id}__extra`,
      id: product.id,
      kind: 'addon',
      name: product.name,
      image: product.image || '',
      quantity: 1,
      subtotal: product.addonPrice,
      regular: product.price,
      units: normalizeUnits(product, null, 1),
    });
  }

  const totalUnits = lines.reduce((n, l) => n + l.quantity, 0);
  const total = lines.reduce((n, l) => n + l.subtotal, 0);

  return { lines, totalUnits, total };
}

// Texto corto con las opciones de una línea ("Dorado · «I love you»").
export function describeUnits(line) {
  return line.units
    .map((u, i) => {
      const text = u.text ? `«${u.text}»` : line.personalized ? 'grabado por coordinar' : '';
      const parts = [u.color, text].filter(Boolean).join(' · ');
      return line.units.length > 1 ? `#${i + 1} ${parts}` : parts;
    })
    .filter(Boolean)
    .join('  |  ');
}
