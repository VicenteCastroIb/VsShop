import { useState } from 'react';
import { STORE } from '../lib/store';
import { useCart } from '../lib/cart';

// Header pegado arriba: logo, selector de moneda, carrito y menú.
export default function Header() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Inicio', href: '#top' },
    { label: 'Colección', href: '#coleccion' },
    { label: 'La tienda', href: '#la-tienda' },
  ];

  return (
    <header className="bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#top" className="font-display text-2xl tracking-tight uppercase">
          {STORE.name}
        </a>

        <div className="flex items-center gap-2">
          {/* Selector de moneda (visual; CLP fijo por ahora). */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-1 border border-ink/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide"
          >
            <span aria-hidden>🌐</span> {STORE.currency}
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative border border-ink/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-ink hover:text-white transition-colors"
          >
            Carrito
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border border-ink/20"
          >
            <span className="sr-only">Menú</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-ink/10 bg-paper">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-sm font-semibold uppercase tracking-wide border-b border-ink/5 last:border-0"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
