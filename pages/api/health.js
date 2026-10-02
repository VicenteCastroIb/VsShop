// Chequeo rápido del portal de pago: abre /api/health en el navegador.
//   pago: true   → el token de Mercado Pago está configurado en el servidor.
//   pago: false  → falta MERCADOPAGO_ACCESS_TOKEN (Vercel → Settings → Environment Variables).
// Solo expone un booleano; nunca el token.
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Método no permitido' });
  }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, pago: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN) });
}
