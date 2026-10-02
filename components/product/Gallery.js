import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from '../Icons';

// Galería deslizable: foto grande, flechas, puntos y miniaturas.
export default function Gallery({ images, alt }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const many = images.length > 1;

  function onScroll() {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(Math.min(images.length - 1, Math.max(0, i)));
  }

  function go(i) {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.min(images.length - 1, Math.max(0, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <div>
      <div className="relative bg-tile md:overflow-hidden md:rounded-xl">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          aria-label="Fotos del producto"
        >
          {images.map((src, i) => (
            <li key={src} className="aspect-square w-full shrink-0 snap-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={i === 0 ? alt : `${alt}, foto ${i + 1}`}
                width="1000"
                height="1000"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchpriority={i === 0 ? 'high' : 'auto'}
                className="h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>

        {many && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-night/80 text-ivory transition-opacity disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.6} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === images.length - 1}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-night/80 text-ivory transition-opacity disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.6} />
            </button>

            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3" aria-hidden="true">
              {images.map((src, i) => (
                <span
                  key={src}
                  className={`rounded-full transition-all ${
                    i === index ? 'h-2.5 w-2.5 bg-night' : 'h-1.5 w-1.5 bg-night/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {many && (
        <ul className="mt-2 grid grid-cols-3 gap-2 px-4 md:px-0">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === index}
                className={`block aspect-square w-full overflow-hidden rounded-md border-2 bg-tile ${
                  i === index ? 'border-gold' : 'border-transparent'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
