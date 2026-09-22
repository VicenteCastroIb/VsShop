import Head from 'next/head';
import Layout from '../components/Layout';
import ProductCard, { ProductCardPlaceholder } from '../components/ProductCard';
import { STORE, PRODUCTS, PLACEHOLDER_SLOTS } from '../lib/store';
import { useCart } from '../lib/cart';

export default function Home() {
  const { setOpen } = useCart();
  const hasProducts = PRODUCTS.length > 0;
  const { hero, feature, stats, collection, label } = STORE;

  return (
    <>
      <Head>
        <title>{`${STORE.name} · Selección de temporada · Despacho a todo Chile`}</title>
        <meta
          name="description"
          content={`${STORE.name}: pocos productos por temporada, bien elegidos. Despacho a todo Chile y pago seguro con Mercado Pago.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0b0c" />
      </Head>

      <Layout>
        {/* ---------------- HERO ---------------- */}
        <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
          <p className="eyebrow">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {hero.eyebrow}
          </p>

          <h1 className="headline mt-4 text-6xl sm:text-7xl">
            {hero.titleLine1}
            <br />
            <span className="text-accent">{hero.titleLine2}</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
            {hero.description}
          </p>

          <a href={hero.ctaHref} className="btn-primary mt-6 w-full sm:w-auto">
            {hero.ctaLabel} <span aria-hidden>→</span>
          </a>
        </section>

        {/* ---------------- DESTACADO ---------------- */}
        <section className="mx-auto max-w-6xl px-4 py-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5 sm:aspect-[16/10]">
            {feature.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={feature.image} alt={feature.caption} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-5xl uppercase text-ink/15">{STORE.name}</span>
              </div>
            )}

            <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
              • {feature.badge}
            </span>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
              {feature.caption}
            </span>
          </div>

          {/* Fila de stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-xs uppercase tracking-wide text-ink/50">{s.label}</p>
                <p className="mt-1 font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- COLECCIÓN ---------------- */}
        <section id="coleccion" className="mx-auto max-w-6xl px-4 py-10">
          <p className="eyebrow">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {collection.eyebrow}
          </p>
          <h2 className="headline mt-3 text-5xl sm:text-6xl">{collection.title}</h2>
          <p className="mt-3 max-w-lg text-ink/60">{collection.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {hasProducts
              ? PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)
              : Array.from({ length: PLACEHOLDER_SLOTS }).map((_, i) => (
                  <ProductCardPlaceholder key={i} />
                ))}
          </div>

          {!hasProducts && (
            <p className="mt-6 text-center text-sm text-ink/40">
              Los productos de la temporada se cargan pronto.
            </p>
          )}
        </section>

        {/* ---------------- LA TIENDA ---------------- */}
        <section id="la-tienda" className="border-y border-ink/10 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="eyebrow">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {label.eyebrow}
            </p>
            <h2 className="headline mt-3 text-4xl sm:text-5xl">{label.title}</h2>
            <p className="mt-4 max-w-xl text-ink/60">{label.description}</p>

            <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {label.highlights.map((h) => (
                <div key={h.small} className="py-6 text-center">
                  <p className="font-display text-4xl uppercase sm:text-5xl">{h.big}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink/50">{h.small}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CTA FINAL ---------------- */}
        <section className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="headline text-4xl sm:text-5xl">¿LISTO PARA VER LA COLECCIÓN?</h2>
          <button type="button" onClick={() => setOpen(true)} className="btn-outline mt-5">
            Abrir carrito
          </button>
        </section>
      </Layout>
    </>
  );
}
