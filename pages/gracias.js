import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { STORE } from '../lib/store';
import { track, makeEventId } from '../lib/fpixel';

export default function Gracias() {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (!router.isReady || fired.current) return;
    fired.current = true;

    const { v, cur, payment_id: paymentId, collection_id: collectionId } = router.query;

    // event_id determinístico: derivado del payment_id de Mercado Pago.
    // Si más adelante agregas Conversions API server-side, envía el MISMO
    // event_id para que Meta deduplique navegador + servidor.
    const seed = paymentId || collectionId || '';
    const eventId = makeEventId(seed);

    // Evita disparar Purchase dos veces si el usuario recarga /gracias.
    const dedupeKey = `mp_purchase_fired_${eventId}`;
    try {
      if (sessionStorage.getItem(dedupeKey)) return;
      sessionStorage.setItem(dedupeKey, '1');
    } catch (e) {
      // sessionStorage no disponible: seguimos igual.
    }

    const value = Number(v) > 0 ? Number(v) : 0;
    const currency = typeof cur === 'string' && cur ? cur : STORE.currency;

    track(
      'Purchase',
      { content_type: 'product', value, currency },
      { eventID: eventId },
    );
  }, [router.isReady, router.query]);

  return (
    <Layout showBottomBar={false}>
      <StatusBlock
        title="¡Gracias por tu compra!"
        text="Tu pago fue aprobado. Te contactaremos al teléfono que dejaste para coordinar el envío."
      />
    </Layout>
  );
}

function StatusBlock({ title, text }) {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <h1 className="headline text-4xl">{title}</h1>
      <p className="mt-4 text-ink/70">{text}</p>
      <a href="/" className="btn-primary mt-8">
        Volver al inicio
      </a>
    </section>
  );
}
