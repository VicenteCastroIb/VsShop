import { STORE, money, getPacks, findProduct, isBuyable } from '../../lib/store';
import { ChevronDown, LockIcon, Stars } from '../Icons';

// Bloque de compra: título, beneficios, packs, extras y botón.
// El estado (pack, opciones por unidad, extras) vive en la página para
// que la barra fija de abajo compre exactamente lo mismo.
export default function BuyBox({
  product,
  qty,
  onSelectPack,
  units,
  onUnitChange,
  addons,
  onToggleAddon,
  onBuy,
  error,
  buyRef,
}) {
  const packs = getPacks(product);
  const buyable = isBuyable(product);
  const { social } = STORE;
  const addonProducts = (product.addons || [])
    .map(findProduct)
    .filter((p) => p && p.addonPrice && isBuyable(p));

  return (
    <div className="px-4 md:px-0">
      {social.rating ? (
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Stars />
          <span>
            {String(social.rating).replace('.', ',')}/5 {social.ratingLabel}
          </span>
        </p>
      ) : null}

      <h1 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-wide sm:text-4xl">{product.name}</h1>

      <ul className="mt-4 space-y-2.5">
        {product.bullets.map((b) => (
          <li key={b.text} className="flex gap-3 text-[15px] leading-snug text-ivory/90">
            <span aria-hidden="true">{b.icon}</span>
            <span>{b.text}</span>
          </li>
        ))}
      </ul>

      {/* ---------- Compra más y ahorra ---------- */}
      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-gold/70" />
        <h2 className="text-base font-bold">Compra Más y Ahorra</h2>
        <span className="h-px flex-1 bg-gold/70" />
      </div>

      <div className="mt-4 space-y-4" role="radiogroup" aria-label="Elige cuántas unidades llevar">
        {packs.map((pack) => {
          const selected = pack.qty === qty;
          return (
            <div
              key={pack.qty}
              className={`relative rounded-xl border-2 transition-colors ${
                selected ? 'border-gold bg-gold/10' : 'border-white/15 bg-surface'
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 right-[-6px] rotate-2 rounded bg-gold px-3 py-0.5 text-sm font-semibold text-night shadow">
                  Más Popular
                </span>
              )}
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelectPack(pack.qty)}
                className="flex w-full items-center gap-3 px-4 py-4 text-left"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-gold' : 'border-white/30'
                  }`}
                  aria-hidden="true"
                >
                  {selected && <span className="h-2.5 w-2.5 rounded-full bg-gold" />}
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-bold leading-tight">Compra {pack.qty}</span>
                  {pack.saving > 0 && (
                    <span className="block text-sm text-ivory/80">Te ahorras {money(pack.saving)}</span>
                  )}
                </span>
                <span className="text-right">
                  <span className="block text-lg font-bold tabular-nums text-gold">{money(pack.price)}</span>
                  {pack.saving > 0 && (
                    <span className="block text-sm tabular-nums text-muted line-through">
                      {money(pack.compareAt)}
                    </span>
                  )}
                </span>
              </button>

              {selected && (
                <div className="space-y-2 px-4 pb-4">
                  {units.map((unit, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2">
                      <span className="w-7 text-base font-bold">#{i + 1}</span>
                      <span className="relative min-w-[8.5rem] flex-1">
                        <select
                          value={unit.color}
                          onChange={(e) => onUnitChange(i, { color: e.target.value })}
                          aria-label={`Color de la unidad ${i + 1}`}
                          className="w-full appearance-none rounded-md border border-white/20 bg-night py-2 pl-3 pr-9 text-base text-ivory focus:border-gold focus:outline-none"
                        >
                          {product.colors.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      </span>
                      {product.personalize && (
                        <input
                          type="text"
                          value={unit.text}
                          onChange={(e) => onUnitChange(i, { text: e.target.value })}
                          maxLength={product.personalize.maxLength}
                          placeholder={product.personalize.placeholder}
                          aria-label={`${product.personalize.label} de la unidad ${i + 1}`}
                          aria-invalid={Boolean(error) && !unit.text.trim()}
                          className={`w-full rounded-md border bg-night px-3 py-2 text-base text-ivory placeholder:text-muted/60 focus:outline-none ${
                            error && !unit.text.trim() ? 'border-red-400' : 'border-white/20 focus:border-gold'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                  {product.personalize && (
                    <p className="text-xs leading-relaxed text-muted">
                      {product.personalize.label}: hasta {product.personalize.maxLength} caracteres.{' '}
                      {product.personalize.help}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-300">
          {error}
        </p>
      )}

      {/* ---------- Extras con descuento ---------- */}
      {addonProducts.length > 0 && (
        <>
          <h2 className="mt-7 text-center text-lg font-bold leading-snug">
            🔥 Agrega esto a tu pedido con descuento 🔥
          </h2>
          <ul className="mt-4 space-y-3">
            {addonProducts.map((addon) => {
              const on = addons.includes(addon.id);
              return (
                <li key={addon.id}>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                      on ? 'border-gold bg-gold/10' : 'border-white/15 bg-surface'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={addon.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-md bg-tile object-cover" />
                    <span className="flex-1 text-sm font-bold leading-snug">{addon.name}</span>
                    <span className="text-right">
                      <span className="block font-bold tabular-nums text-gold">{money(addon.addonPrice)}</span>
                      <span className="block text-xs tabular-nums text-muted line-through">{money(addon.price)}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) => onToggleAddon(addon.id, e.target.checked)}
                      className="peer sr-only"
                      aria-label={`Agregar ${addon.name} por ${money(addon.addonPrice)}`}
                    />
                    <span
                      aria-hidden="true"
                      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${
                        on ? 'bg-gold' : 'bg-white/25'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                          on ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* ---------- Comprar ---------- */}
      <button ref={buyRef} type="button" onClick={onBuy} disabled={!buyable} className="btn-gold mt-6 w-full text-xl">
        {buyable ? 'Comprar Ahora' : 'Agotado'}
      </button>

      <div className="mt-4 flex flex-col items-center gap-2 text-center">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <LockIcon className="h-4 w-4 text-gold" /> Pago seguro con Mercado Pago
        </p>
        <ul className="flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-muted">
          {['Tarjeta de crédito', 'Tarjeta de débito', 'Saldo Mercado Pago'].map((m) => (
            <li key={m} className="rounded border border-white/15 px-2 py-1">
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
