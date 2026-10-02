import { STORE, REGIONES_CHILE, buildOrder, describeUnits } from '../../lib/store';

export const config = {
  api: { bodyParser: { sizeLimit: '16kb' } },
};

// Texto plano acotado: sin caracteres de control ni saltos de línea.
function clean(value, max) {
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  return String(value)
    .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function parsePayer(raw) {
  const p = raw && typeof raw === 'object' ? raw : {};
  const payer = {
    nombre: clean(p.nombre, 60),
    apellido: clean(p.apellido, 60),
    email: clean(p.email, 120).toLowerCase(),
    telefono: clean(p.telefono, 20),
    direccion: clean(p.direccion, 160),
    comuna: clean(p.comuna, 60),
    region: clean(p.region, 60),
  };

  if (!payer.nombre || !payer.telefono || !payer.direccion || !payer.comuna || !payer.region) {
    return { error: 'Faltan datos del comprador.' };
  }
  if (!/^\+?[\d\s()-]{8,20}$/.test(payer.telefono) || payer.telefono.replace(/\D/g, '').length < 8) {
    return { error: 'El teléfono no es válido.' };
  }
  if (payer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payer.email)) {
    return { error: 'El email no es válido.' };
  }
  if (!REGIONES_CHILE.includes(payer.region)) {
    return { error: 'La región no es válida.' };
  }
  return { payer };
}

// URL base para los retornos de pago. Si defines SITE_URL en Vercel se usa
// esa (recomendado); si no, se toma el host de la petición ya validado.
function getBaseUrl(req) {
  const fixed = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
  if (/^https:\/\/[a-z0-9.-]+$/i.test(fixed)) return fixed;

  const host = String(req.headers.host || '');
  if (!/^[a-z0-9.-]+(:\d{1,5})?$/i.test(host)) return null;
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
  return `${local ? 'http' : 'https'}://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('Falta la variable de entorno MERCADOPAGO_ACCESS_TOKEN.');
    return res.status(503).json({ error: 'El pago no está disponible en este momento.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  const parsed = parsePayer(body.payer);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const { payer } = parsed;

  // El total y los items se calculan acá desde lib/store.js (fuente de
  // verdad); nunca se confía en montos ni precios que vengan del cliente.
  const order = buildOrder(body.cart);
  if (!order.lines.length || order.total <= 0) {
    return res.status(400).json({ error: 'El carrito está vacío.' });
  }

  const baseUrl = getBaseUrl(req);
  if (!baseUrl) return res.status(400).json({ error: 'Solicitud no válida.' });

  // Cada línea va como 1 ítem con su subtotal: los packs no siempre dan un
  // precio unitario entero y Mercado Pago exige enteros en CLP.
  const items = order.lines.map((line) => ({
    id: line.key,
    title:
      `${STORE.name} - ${line.name}` +
      (line.kind === 'addon' ? ' (extra)' : line.quantity > 1 ? ` x${line.quantity}` : ''),
    quantity: 1,
    currency_id: STORE.currency,
    unit_price: line.subtotal,
  }));

  // Monto y moneda viajan a /gracias para el evento Purchase del Pixel.
  // Mercado Pago agrega payment_id, status y merchant_order_id al volver.
  const successUrl = `${baseUrl}/gracias?v=${order.total}&cur=${STORE.currency}`;

  const preference = {
    items,
    payer: {
      name: payer.nombre,
      surname: payer.apellido,
      email: payer.email || undefined,
      phone: { number: payer.telefono },
      address: { street_name: payer.direccion },
    },
    metadata: {
      lineas: order.lines.map((l) => ({
        item: l.key,
        cantidad: l.quantity,
        subtotal: l.subtotal,
        opciones: describeUnits(l),
      })),
      total: order.total,
      unidades: order.totalUnits,
      nombre: `${payer.nombre} ${payer.apellido}`.trim(),
      comuna: payer.comuna,
      region: payer.region,
      direccion: payer.direccion,
      telefono: payer.telefono,
    },
    back_urls: {
      success: successUrl,
      pending: `${baseUrl}/pago-pendiente`,
      failure: `${baseUrl}/pago-fallido`,
    },
    auto_return: 'approved',
  };

  try {
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await mpResponse.json().catch(() => ({}));

    if (!mpResponse.ok || !data.init_point) {
      // El detalle queda solo en los logs del servidor, no se expone al cliente.
      console.error('Error de Mercado Pago:', mpResponse.status, data);
      return res.status(502).json({ error: 'No se pudo iniciar el pago. Intenta nuevamente.' });
    }

    return res.status(200).json({ init_point: data.init_point, total: order.total });
  } catch (err) {
    console.error('Error creando preferencia:', err);
    return res.status(502).json({ error: 'No se pudo conectar con Mercado Pago.' });
  }
}
