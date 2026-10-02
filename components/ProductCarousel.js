import { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from './Icons';

// Carrusel horizontal: 2 tarjetas visibles en móvil, flechas debajo.
export default function ProductCarousel({ products }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  function move(direction) {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return;
    const step = el.firstElementChild.getBoundingClientRect().width + 16;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  return (
    <div>
      <ul
        ref={trackRef}
        onScroll={update}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4"
      >
        {products.map((p) => (
          <li
            key={p.id}
            className="w-[calc((100%-1rem)/2)] shrink-0 snap-start md:w-[calc((100%-3rem)/4)]"
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      <div className={`mt-3 flex items-center justify-center gap-6 ${edges.start && edges.end ? 'hidden' : ''}`}>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={edges.start}
          aria-label="Productos anteriores"
          className="flex h-11 w-11 items-center justify-center text-ivory transition-opacity disabled:opacity-30"
        >
          <ChevronLeft className="h-7 w-7" strokeWidth={2.4} />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={edges.end}
          aria-label="Productos siguientes"
          className="flex h-11 w-11 items-center justify-center text-ivory transition-opacity disabled:opacity-30"
        >
          <ChevronRight className="h-7 w-7" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
