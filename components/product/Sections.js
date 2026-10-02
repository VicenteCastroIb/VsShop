import { useId, useRef, useState } from 'react';
import { STORE } from '../../lib/store';
import {
  CheckIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CrossIcon,
  HelpIcon,
  InfoIcon,
  StarOutlineIcon,
  Stars,
  TruckIcon,
} from '../Icons';

const ICONS = { help: HelpIcon, star: StarOutlineIcon, truck: TruckIcon, info: InfoIcon };

// Convierte **texto** en negrita. El contenido viene de lib/store.js.
function Rich({ text }) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-ivory">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// Onda decorativa entre secciones (fondo de página ↔ sección destacada).
function Wave({ flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-10 w-full ${flip ? 'rotate-180' : ''}`}
    >
      <path d="M0 50 C 320 5 760 95 1440 28 V90 H0 Z" fill="#c9a55c" opacity="0.28" />
      <path d="M0 62 C 420 22 980 100 1440 46 V90 H0 Z" fill="#141416" />
    </svg>
  );
}

// Sección destacada (equivale a los bloques de color de la referencia).
function AccentSection({ children }) {
  return (
    <section className="mt-12">
      <Wave />
      <div className="-my-px bg-surface px-5 pb-10 pt-6">
        <div className="mx-auto max-w-2xl">{children}</div>
      </div>
      <Wave flip />
    </section>
  );
}

function AccordionItem({ icon = 'info', title, children, defaultOpen = false, iconClass = 'text-ivory' }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const Icon = ICONS[icon] || InfoIcon;

  return (
    <div className="border-b border-white/15">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center gap-3 py-4 text-left"
        >
          <Icon className={`h-6 w-6 shrink-0 ${iconClass}`} />
          <span className="flex-1 text-[17px] font-bold leading-snug">{title}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pb-5 pl-9 pr-2 text-[15px] leading-relaxed text-ivory/80">
        {children}
      </div>
    </div>
  );
}

// ¿Qué incluye? / Materiales / Envíos.
export function DetailsAccordion({ product }) {
  const items = [...product.details, { icon: 'truck', title: 'Envíos & Procesamiento', body: STORE.shipping }];
  return (
    <div className="mx-auto mt-8 max-w-2xl border-t border-white/15 px-4">
      {items.map((item) => (
        <AccordionItem key={item.title} icon={item.icon} title={item.title}>
          <Rich text={item.body} />
        </AccordionItem>
      ))}
    </div>
  );
}

export function FaqSection({ product }) {
  if (!product.faq || !product.faq.length) return null;
  return (
    <AccentSection>
      <h2 className="section-title">Preguntas Frecuentes</h2>
      <div className="mt-4">
        {product.faq.map((item) => (
          <AccordionItem key={item.q} icon="info" iconClass="text-gold" title={item.q} defaultOpen>
            <Rich text={item.a} />
          </AccordionItem>
        ))}
      </div>
    </AccentSection>
  );
}

export function StorySection({ product }) {
  const { story } = product;
  if (!story) return null;
  return (
    <section className="mx-auto mt-12 max-w-2xl px-4 text-center">
      <h2 className="section-title">{story.title}</h2>
      <div className="mt-6 space-y-5 text-[15px] leading-loose text-ivory/85">
        {story.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {story.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.image}
          alt={product.name}
          width="900"
          height="900"
          loading="lazy"
          className="mt-8 aspect-[4/3] w-full rounded-2xl bg-tile object-cover"
        />
      )}
    </section>
  );
}

// Reseñas REALES (STORE.social.reviews). Sin reseñas no se muestra nada.
export function reviewsFor(product) {
  return (STORE.social.reviews || []).filter((r) => r && r.text && (!r.productId || r.productId === product.id));
}

export function ReviewSlider({ product, compact = false }) {
  const reviews = reviewsFor(product);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  if (!reviews.length) return null;

  function go(i) {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.min(reviews.length - 1, Math.max(0, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  }

  function onScroll() {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  const dots = reviews.length > 1 && (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      {reviews.map((r, i) => (
        <span
          key={i}
          className={`rounded-full transition-all ${i === index ? 'h-2.5 w-2.5 bg-ivory' : 'h-1.5 w-1.5 bg-ivory/40'}`}
        />
      ))}
    </div>
  );

  if (compact) {
    return (
      <div className="mt-6 px-4 md:px-0">
        <ul ref={trackRef} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {reviews.map((r, i) => (
            <li key={i} className="w-full shrink-0 snap-center">
              <p className="text-[15px] leading-relaxed text-ivory/90">{r.text}</p>
              <p className="mt-2 flex items-center gap-2 border-t border-white/15 pt-2 text-sm font-semibold italic text-muted">
                {r.author} <Stars />
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-3">{dots}</div>
      </div>
    );
  }

  return (
    <section className="mx-auto mt-12 max-w-2xl px-4">
      <h2 className="section-title">{STORE.social.title}</h2>
      <ul ref={trackRef} onScroll={onScroll} className="no-scrollbar mt-6 flex snap-x snap-mandatory overflow-x-auto">
        {reviews.map((r, i) => (
          <li key={i} className="w-full shrink-0 snap-center">
            <figure className="relative mx-1 rounded-3xl bg-surface px-6 py-7 text-center">
              <span
                aria-hidden="true"
                className="absolute -top-1 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-2xl font-bold leading-none text-night"
              >
                ”
              </span>
              <Stars className="h-5 w-5" />
              {r.title && <p className="mt-2 text-xl font-bold">{r.title}</p>}
              <blockquote className="mt-2 text-[15px] leading-loose text-ivory/85">{r.text}</blockquote>
              <figcaption className="mt-4 border-t border-white/15 pt-3 font-semibold italic">{r.author}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {reviews.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-5">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Reseña anterior" className="p-2 disabled:opacity-30">
            <ChevronLeft className="h-6 w-6" strokeWidth={2.4} />
          </button>
          {dots}
          <button type="button" onClick={() => go(index + 1)} disabled={index === reviews.length - 1} aria-label="Reseña siguiente" className="p-2 disabled:opacity-30">
            <ChevronRight className="h-6 w-6" strokeWidth={2.4} />
          </button>
        </div>
      )}
    </section>
  );
}

// Fotos REALES de clientes (STORE.social.photos). Vacío = no se muestra.
export function CustomerPhotos() {
  const photos = STORE.social.photos || [];
  if (!photos.length) return null;
  return (
    <section className="mx-auto mt-12 max-w-2xl px-4">
      <h2 className="section-title">Únete a nuestros {STORE.social.title}</h2>
      <ul className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4">
        {photos.map((src) => (
          <li key={src} className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Foto de un cliente" loading="lazy" className="aspect-[3/4] w-full rounded-md object-cover" />
          </li>
        ))}
      </ul>
    </section>
  );
}

// Sello propio de garantía (SVG).
function Seal({ days }) {
  const points = Array.from({ length: 72 }, (_, i) => {
    const r = i % 2 === 0 ? 98 : 91;
    const a = (i / 72) * Math.PI * 2;
    return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 240 200" role="img" aria-label={`Garantía de ${days} días`} className="mx-auto w-56">
      <defs>
        <linearGradient id="seal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0d99a" />
          <stop offset="0.5" stopColor="#c9a55c" />
          <stop offset="1" stopColor="#8f6f2f" />
        </linearGradient>
        <path id="seal-top" d="M 34 100 A 66 66 0 0 1 166 100" />
        <path id="seal-bottom" d="M 24 100 A 76 76 0 0 0 176 100" />
      </defs>
      <g transform="translate(20 0)">
        <polygon points={points} fill="url(#seal-gold)" />
        <circle cx="100" cy="100" r="84" fill="#0a0a0b" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="url(#seal-gold)" strokeWidth="1.5" strokeDasharray="1 5" />
        <text fill="#f0d99a" fontSize="19" fontWeight="700" letterSpacing="3" textAnchor="middle">
          <textPath href="#seal-top" startOffset="50%">
            GARANTÍA
          </textPath>
        </text>
        <text fill="#f0d99a" fontSize="11" fontWeight="600" letterSpacing="3" textAnchor="middle">
          <textPath href="#seal-bottom" startOffset="50%">
            COMPRA SEGURA
          </textPath>
        </text>
      </g>
      <path d="M0 78 H240 L228 100 L240 122 H0 L12 100 Z" fill="url(#seal-gold)" />
      <text x="120" y="112" fill="#0a0a0b" fontSize="32" fontWeight="700" letterSpacing="2" textAnchor="middle">
        {days} DÍAS
      </text>
    </svg>
  );
}

export function GuaranteeSection() {
  const { guarantee } = STORE;
  if (!guarantee) return null;
  return (
    <AccentSection>
      <Seal days={guarantee.days} />
      <h2 className="section-title mt-6">{guarantee.title}</h2>
      <div className="mt-5 space-y-5 text-center text-[15px] leading-loose text-ivory/85">
        {guarantee.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </AccentSection>
  );
}

export function CompareTable({ product }) {
  const rows = product.compare || [];
  if (!rows.length) return null;
  const { comparison } = STORE;
  return (
    <section className="mx-auto mt-12 max-w-2xl px-4">
      <h2 className="section-title">{comparison.title}</h2>
      <table className="mt-7 w-full table-fixed border-separate border-spacing-0 text-center">
        <thead>
          <tr>
            <td className="w-[38%]" />
            <th scope="col" className="px-2 pb-3 text-[15px] font-bold leading-tight text-gold">
              {comparison.usLabel}
            </th>
            <th scope="col" className="px-2 pb-3 text-[15px] font-bold leading-tight text-muted">
              {comparison.themLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const first = i === 0;
            const last = i === rows.length - 1;
            return (
              <tr key={row}>
                <th
                  scope="row"
                  className={`bg-gold px-3 py-4 text-[15px] font-bold leading-snug text-night ${
                    first ? 'rounded-tl-2xl' : 'border-t border-night/15'
                  } ${last ? 'rounded-bl-2xl' : ''}`}
                >
                  {row}
                </th>
                <td className={`border-white/15 bg-surface ${first ? '' : 'border-t'}`}>
                  <CheckIcon className="mx-auto h-6 w-6 text-gold" />
                  <span className="sr-only">Sí</span>
                </td>
                <td
                  className={`border-l border-white/15 bg-surface ${first ? 'rounded-tr-2xl' : 'border-t'} ${
                    last ? 'rounded-br-2xl' : ''
                  }`}
                >
                  <CrossIcon className="mx-auto h-5 w-5 text-muted" />
                  <span className="sr-only">No</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
