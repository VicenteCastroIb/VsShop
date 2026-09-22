import { useState } from 'react';
import { STORE } from '../lib/store';
import { useCart } from '../lib/cart';

// Barra inferior fija (descartable), como en la referencia.
export default function BottomBar() {
  const [closed, setClosed] = useState(false);
  const { count, setOpen } = useCart();

  // Si hay algo en el carrito, la barra invita a ir a pagar.
  const hasItems = count > 0;

  if (closed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 bg-ink px-4 py-3 text-white shadow-lg">
        <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {hasItems ? `${count} en tu carrito` : STORE.bottomBar.text}
        </span>
        {hasItems ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink"
          >
            Ver carrito
          </button>
        ) : (
          <a
            href={STORE.bottomBar.ctaHref}
            className="bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink"
          >
            {STORE.bottomBar.ctaLabel}
          </a>
        )}
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Cerrar"
          className="text-lg leading-none text-white/70 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}
