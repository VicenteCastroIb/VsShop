import Link from 'next/link';
import { STORE, whatsappUrl } from '../lib/store';
import Header from './Header';
import CartDrawer from './CartDrawer';
import { ChatIcon } from './Icons';

// raiseFloat: sube el botón de WhatsApp cuando hay barra fija de compra.
export default function Layout({ children, raiseFloat = false }) {
  const wa = whatsappUrl();

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>

      <footer id="contacto" className="mt-16 border-t border-white/10 bg-black">
        <div className="mx-auto max-w-5xl px-4 pb-28 pt-10 text-sm text-muted">
          <p className="font-display text-3xl uppercase tracking-wide text-ivory">{STORE.name}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-gold">{STORE.tagline}</p>

          <ul className="mt-6 space-y-2">
            <li>
              <Link href="/" className="hover:text-ivory">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/#productos" className="hover:text-ivory">
                Catálogo
              </Link>
            </li>
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                  Escríbenos por WhatsApp
                </a>
              </li>
            )}
          </ul>

          <p className="mt-6">{STORE.announcement} · Pago seguro con Mercado Pago.</p>
          <p className="mt-6 text-xs text-muted/60">
            © {new Date().getFullYear()} {STORE.name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          className={`fixed left-4 z-30 flex h-14 w-14 items-center justify-center rounded-xl bg-[#25d366] text-white shadow-lg shadow-black/40 transition-all ${
            raiseFloat ? 'bottom-24' : 'bottom-5'
          }`}
        >
          <ChatIcon className="h-8 w-8" />
        </a>
      )}

      <CartDrawer />
    </div>
  );
}
