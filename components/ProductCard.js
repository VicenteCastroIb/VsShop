import Link from 'next/link';
import { money, discountPercent, productHref } from '../lib/store';
import { TagIcon } from './Icons';

// Tarjeta de producto: foto, sello de ahorro, nombre y precio.
export default function ProductCard({ product }) {
  const off = discountPercent(product);
  const soldOut = product.status === 'soldout';

  return (
    <Link
      href={productHref(product)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-surface shadow-lg shadow-black/40"
    >
      <div className="relative aspect-square overflow-hidden bg-tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          width="1000"
          height="1000"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {soldOut ? (
          <span className="absolute left-0 top-3 rounded-r-md bg-night px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ivory">
            Agotado
          </span>
        ) : (
          off > 0 && (
            <span className="absolute left-0 top-3 flex items-center gap-1.5 rounded-r-md bg-night px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gold">
              <TagIcon className="h-3.5 w-3.5" />
              Ahorra {off}%
            </span>
          )
        )}
      </div>

      <div className="flex flex-1 flex-col items-center px-3 pb-5 pt-4 text-center">
        <h3 className="text-[15px] font-bold leading-snug sm:text-base">{product.name}</h3>
        <p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2">
          <span className="text-base font-bold tabular-nums text-gold">{money(product.price)}</span>
          {off > 0 && (
            <span className="text-xs font-semibold tabular-nums text-muted line-through">
              {money(product.compareAtPrice)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
