import { STORE, buildOrder } from '../../lib/store';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({
      error:
        'Falta configurar la variable de entorno MERCADOPAGO_ACCESS_TOKEN. Agrégala en Vercel (o en tu .env.local).',
    });
  }

  const { cart, payer } = req.body || {};

  if (!payer || !payer.nombre || !payer.telefono || !payer.direccion || !payer.comuna || !payer.region) {
    return res.status(400).json({ error: 'Faltan datos del comprador.' });
  }

  // El total y los items se calculan acá desde lib/store.js (fuente de
  // verdad), nunca se confía en montos que vengan del cliente.
  const order = buildOrder(cart);

  if (!order.lines.length) {
    return res.status(400).json({ error: 'El carrito está vacío.' });
  }

  const items = order.lines.map((line) => ({
    id: line.id,
    title: `${STORE.name} - ${line.name}`,
    quantity: line.quantity,
    currency_id: STORE.currency,
    unit_price: line.unitPrice,
  }));

  // Vercel expone el protocolo real en x-forwarded-proto; en local cae a http.
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const baseUrl = `${proto}://${host}`;

  // Pasamos el monto y la moneda a /gracias para el evento Purchase del
  // Pixel de Meta. Mercado Pago agrega además payment_id, status y
  // merchant_order_id a esa misma URL al volver.
  const successUrl = `${baseUrl}/gracias?v=${order.total}&cur=${STORE.currency}`;

  const preference = {
    items,
    payer: {
      name: payer.nombre,
      surname: payer.apellido || '',
      email: payer.email || undefined,
      phone: payer.telefono ? { number: String(payer.telefono) } : undefined,
      address: {
        street_name: payer.direccion,
      },
    },
    metadata: {
      lineas: order.lines.map((l) => ({
        item: l.id,
        cantidad: l.quantity,
        precio_unitario: l.unitPrice,
        subtotal: l.subtotal,
      })),
      total: order.total,
      unidades: order.totalUnits,
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

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Error de Mercado Pago:', data);
      return res.status(502).json({
        error: data.message || 'Mercado Pago rechazó la solicitud.',
        details: data,
      });
    }

    return res.status(200).json({
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      total: order.total,
    });
  } catch (err) {
    console.error('Error creando preferencia:', err);
    return res.status(500).json({ error: 'No se pudo conectar con Mercado Pago.' });
  }
}
