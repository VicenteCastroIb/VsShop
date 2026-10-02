import Head from 'next/head';
import Layout from '../components/Layout';
import ProductCarousel from '../components/ProductCarousel';
import { STORE, PRODUCTS } from '../lib/store';

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${STORE.name} · ${STORE.tagline} · ${STORE.announcement}`}</title>
        <meta
          name="description"
          content={`${STORE.name}: joyas y accesorios para regalar. ${STORE.announcement} y pago seguro con Mercado Pago.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <Layout>
        <section id="productos" className="mx-auto max-w-5xl scroll-mt-24 px-4 pb-10 pt-10">
          <h1 className="section-title">{STORE.home.title}</h1>

          <div className="mt-8">
            {PRODUCTS.length > 0 ? (
              <ProductCarousel products={PRODUCTS} />
            ) : (
              <p className="py-16 text-center text-muted">Pronto cargaremos los productos de la temporada.</p>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
