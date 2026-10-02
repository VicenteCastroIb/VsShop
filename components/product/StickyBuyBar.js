import { money } from '../../lib/store';

// Barra fija inferior: aparece cuando el botón principal sale de pantalla.
export default function StickyBuyBar({ product, visible, onBuy }) {
  return (
    <div
      className={`safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-night/95 px-4 pt-3 backdrop-blur transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'invisible translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[15px] font-bold leading-tight">{product.name}</p>
          <p className="mt-0.5 flex items-baseline gap-2">
            <span className="font-bold tabular-nums text-gold">{money(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs font-semibold tabular-nums text-muted line-through">
                {money(product.compareAtPrice)}
              </span>
            )}
          </p>
        </div>
        <button type="button" onClick={onBuy} tabIndex={visible ? 0 : -1} className="btn-gold shrink-0 px-5 py-3 text-base">
          Comprar Ahora
        </button>
      </div>
    </div>
  );
}
