import { STORE, formatCLP, discountPercent, isBuyable } from '../lib/store';
import { useCart } from '../lib/cart';

// Etiqueta de estado (esquina superior de la card).
function StatusBadge({ status }) {
  if (status === 'preorder') {
    return (
      <span className="absolute left-0 top-3 bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
        Preventa
      </span>
    );
  }
  if (status === 'soldout') {
    return (
      <span className="absolute left-0 top-3 bg-ink/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
        Agotado
      </span>
    );
  }
  return null;
}

// Tarjeta de producto real.
export default function ProductCard({ product }) {
  const { add } = useCart();
  const off = discountPercent(product);
  const buyable = isBuyable(product);

  return (
    <article className="flex flex-col border border-ink/10 bg-white">
      <div className="relative aspect-square overflow-hidden bg-paper">
        <StatusBadge status={product.status} />
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/20 font-display text-4xl">
            {STORE.name}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
          <h3 className="font-display text-xl uppercase leading-none">{product.name}</h3>
          <div className="flex items-baseline gap-2 sm:block sm:text-right">
            <span className="block font-bold">
              {STORE.currencySymbol}
              {formatCLP(product.price)}
            </span>
            {off > 0 && (
              <span className="text-xs text-ink/40 line-through">
                {STORE.currencySymbol}
                {formatCLP(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {product.tagline && (
          <p className="text-sm text-ink/60">{product.tagline}</p>
        )}

        <button
          type="button"
          disabled={!buyable}
          onClick={() => add(product.id)}
          className="mt-auto border border-ink px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          {product.status === 'soldout'
            ? 'Agotado'
            : product.status === 'preorder'
            ? 'Reservar'
            : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}

// Tarjeta "placeholder" mientras no hay productos cargados.
export function ProductCardPlaceholder() {
  return (
    <article className="flex flex-col border border-dashed border-ink/20 bg-white/50">
      <div className="flex aspect-square items-center justify-center bg-paper text-ink/25">
        <span className="text-xs font-semibold uppercase tracking-widest">Producto</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-4 w-2/3 rounded bg-ink/10" />
        <div className="h-3 w-1/2 rounded bg-ink/10" />
        <div className="mt-auto h-10 w-full border border-dashed border-ink/20" />
      </div>
    </article>
  );
}
