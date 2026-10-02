import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Gallery from '../../components/product/Gallery';
import BuyBox from '../../components/product/BuyBox';
import StickyBuyBar from '../../components/product/StickyBuyBar';
import {
  CompareTable,
  CustomerPhotos,
  DetailsAccordion,
  FaqSection,
  GuaranteeSection,
  ReviewSlider,
  StorySection,
} from '../../components/product/Sections';
import {
  STORE,
  PRODUCTS,
  findProduct,
  isBuyable,
  normalizeUnits,
  discountPercent,
  filterEngraving,
} from '../../lib/store';
import { useCart } from '../../lib/cart';
import { track } from '../../lib/fpixel';

export function getStaticPaths() {
  return { paths: PRODUCTS.map((p) => ({ params: { id: p.id } })), fallback: false };
}

export function getStaticProps({ params }) {
  return { props: { id: params.id } };
}

export default function ProductPage({ id }) {
  const product = findProduct(id);
  const { buyNow } = useCart();
  const buyRef = useRef(null);
  const boxRef = useRef(null);

  const [qty, setQty] = useState(1);
  const [units, setUnits] = useState(() => normalizeUnits(product, null, 1));
  const [addons, setAddons] = useState([]);
  const [error, setError] = useState('');
  const [sticky, setSticky] = useState(false);

  // Al navegar entre productos se reinicia la selección.
  useEffect(() => {
    setQty(1);
    setUnits(normalizeUnits(product, null, 1));
    setAddons([]);
    setError('');
    track('ViewContent', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: STORE.currency,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // La barra fija aparece cuando el botón "Comprar ahora" ya quedó arriba.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      setSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  function selectPack(nextQty) {
    setQty(nextQty);
    // Conserva lo ya escrito (el texto se limpia recién al comprar).
    setUnits((prev) => Array.from({ length: nextQty }, (_, i) => prev[i] || normalizeUnits(product, null, 1)[0]));
    setError('');
  }

  function changeUnit(index, patch) {
    const next = { ...patch };
    if (typeof next.text === 'string' && product.personalize) {
      next.text = filterEngraving(next.text, product.personalize.maxLength);
    }
    setUnits((prev) => prev.map((u, i) => (i === index ? { ...u, ...next } : u)));
    setError('');
  }

  function toggleAddon(addonId, on) {
    setAddons((prev) => (on ? [...prev.filter((a) => a !== addonId), addonId] : prev.filter((a) => a !== addonId)));
  }

  function buy() {
    if (!isBuyable(product)) return;
    const clean = normalizeUnits(product, units, qty);
    if (product.personalize && clean.some((u) => !u.text)) {
      setError(`Escribe el ${product.personalize.label.toLowerCase()} de cada unidad antes de comprar.`);
      if (boxRef.current) boxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    buyNow(product.id, { qty, units: clean, addons });
  }

  const off = discountPercent(product);
  const description = `${product.name}${off ? ` con ${off}% de descuento` : ''}. ${STORE.announcement} y pago seguro con Mercado Pago.`;

  return (
    <>
      <Head>
        <title>{`${product.name} · ${STORE.name}`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta property="og:title" content={`${product.name} · ${STORE.name}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
      </Head>

      <Layout raiseFloat>
        <div className="mx-auto max-w-5xl md:grid md:grid-cols-2 md:gap-10 md:px-4 md:pt-8">
          <Gallery key={product.id} images={product.images || [product.image]} alt={product.name} />

          <div ref={boxRef} className="scroll-mt-24 pt-5 md:pt-0">
            <BuyBox
              product={product}
              qty={qty}
              onSelectPack={selectPack}
              units={units}
              onUnitChange={changeUnit}
              addons={addons}
              onToggleAddon={toggleAddon}
              onBuy={buy}
              error={error}
              buyRef={buyRef}
            />
            <ReviewSlider key={`mini-${product.id}`} product={product} compact />
          </div>
        </div>

        <DetailsAccordion key={`det-${product.id}`} product={product} />
        <CustomerPhotos />
        <FaqSection key={`faq-${product.id}`} product={product} />
        <StorySection product={product} />
        <ReviewSlider key={`rev-${product.id}`} product={product} />
        <GuaranteeSection />
        <CompareTable product={product} />

        <StickyBuyBar product={product} visible={sticky} onBuy={buy} />
      </Layout>
    </>
  );
}
