import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { STORE, PRODUCTS, money, productHref, whatsappUrl } from '../lib/store';
import { useCart } from '../lib/cart';
import { BagIcon, BoxIcon, CloseIcon, MenuIcon, SearchIcon } from './Icons';

// Barra de anuncio + header (menú a la izquierda, logo al centro,
// búsqueda y carrito a la derecha) + menú lateral + buscador.
export default function Header() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Bloquea el scroll del fondo mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <div className="flex items-center justify-center gap-2 border-b border-gold/25 bg-black px-4 py-2.5 text-sm font-semibold text-gold">
        <BoxIcon className="h-4 w-4" />
        <span>{STORE.announcement}</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-night/95 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-4 py-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="-ml-2 flex h-11 w-11 items-center justify-center justify-self-start"
          >
            <MenuIcon className="h-7 w-7" />
          </button>

          <Link href="/" className="flex flex-col items-center leading-none" aria-label={`${STORE.name}, inicio`}>
            <span className="font-display text-[1.9rem] uppercase tracking-wide">{STORE.name}</span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.28em] text-gold">
              {STORE.tagline}
            </span>
          </Link>

          <div className="flex items-center justify-self-end">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Buscar"
              aria-expanded={searchOpen}
              className="flex h-11 w-11 items-center justify-center"
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              onClick={() => openCart('cart')}
              aria-label={`Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
              className="relative -mr-2 flex h-11 w-11 items-center justify-center"
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute bottom-1.5 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold tracking-normal text-night">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      </header>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function SearchPanel({ onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return PRODUCTS;
    return PRODUCTS.filter((p) => normalize(p.name).includes(q));
  }, [query]);

  return (
    <div className="absolute inset-x-0 top-full border-b border-white/10 bg-night shadow-2xl">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <label className="flex items-center gap-2 rounded-lg border border-white/15 bg-surface px-3">
          <SearchIcon className="h-5 w-5 text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, 60))}
            placeholder="Buscar producto"
            aria-label="Buscar producto"
            className="w-full bg-transparent py-3 text-base text-ivory placeholder:text-muted/70 focus:outline-none"
          />
        </label>

        <ul className="mt-3 max-h-[55vh] divide-y divide-white/10 overflow-y-auto">
          {results.map((p) => (
            <li key={p.id}>
              <Link href={productHref(p)} onClick={onClose} className="flex items-center gap-3 py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="h-12 w-12 rounded-md bg-tile object-cover" />
                <span className="flex-1 text-sm font-semibold">{p.name}</span>
                <span className="text-sm font-bold text-gold">{money(p.price)}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && (
            <li className="py-4 text-center text-sm text-muted">No encontramos productos con ese nombre.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function MenuDrawer({ open, onClose }) {
  const wa = whatsappUrl();
  const links = [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/#productos' },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/70 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[88%] max-w-sm flex-col bg-night shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'invisible -translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-2xl font-bold">Menu</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-10 w-10 items-center justify-center rounded bg-surface"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-5">
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-white/10">
                <Link href={l.href} onClick={onClose} className="block py-4 text-lg">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="border-b border-white/10">
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" onClick={onClose} className="block py-4 text-lg">
                  Contacto
                </a>
              ) : (
                <a href="#contacto" onClick={onClose} className="block py-4 text-lg">
                  Contacto
                </a>
              )}
            </li>
          </ul>
        </nav>

        <p className="mt-auto px-5 pb-6 text-xs text-muted">
          {STORE.announcement} · Pago seguro con Mercado Pago
        </p>
      </aside>
    </>
  );
}
