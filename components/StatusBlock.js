import Head from 'next/head';
import Link from 'next/link';
import { STORE } from '../lib/store';

// Bloque centrado para las páginas de retorno del pago.
export default function StatusBlock({ title, text }) {
  return (
    <>
      <Head>
        <title>{`${title} · ${STORE.name}`}</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <section className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <h1 className="section-title">{title}</h1>
        <p className="mt-4 leading-relaxed text-muted">{text}</p>
        <Link href="/" className="btn-gold mt-8">
          Volver al inicio
        </Link>
      </section>
    </>
  );
}
