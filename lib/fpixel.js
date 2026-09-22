// Helper central para el Pixel de Meta (Facebook Pixel).
// El ID se lee de la variable de entorno pública NEXT_PUBLIC_META_PIXEL_ID.
// Si no está definida, todas las funciones son no-op (no rompe el sitio).

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

export const pixelEnabled = () => Boolean(META_PIXEL_ID);

// PageView: se dispara en la carga inicial (snippet base) y en cada
// cambio de ruta del lado del cliente.
export function pageview() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', 'PageView');
}

// Evento estándar de Meta (ViewContent, InitiateCheckout, Purchase, etc.).
// options permite pasar { eventID } para la deduplicación con Conversions API.
export function track(name, params = {}, options = undefined) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (options) {
    window.fbq('track', name, params, options);
  } else {
    window.fbq('track', name, params);
  }
}

// Genera un event_id único y estable para deduplicar.
// Si más adelante agregas Conversions API server-side, envía el MISMO
// event_id (por ejemplo derivado del payment_id de Mercado Pago) para que
// Meta una el evento del navegador con el del servidor.
export function makeEventId(seed) {
  if (seed) return `purchase_${seed}`;
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `evt_${crypto.randomUUID()}`;
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
