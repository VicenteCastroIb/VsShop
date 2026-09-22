import { STORE } from '../lib/store';
import Marquee from './Marquee';
import Header from './Header';
import BottomBar from './BottomBar';
import CartDrawer from './CartDrawer';

export default function Layout({ children, showBottomBar = true }) {
  return (
    <div id="top" className="min-h-screen">
      {/* Cinta + header quedan pegados arriba y acompañan el scroll. */}
      <div className="sticky top-0 z-40">
        <Marquee />
        <Header />
      </div>
      <main>{children}</main>

      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink/60">
          <p className="font-display text-3xl uppercase text-ink">{STORE.name}</p>
          <p className="mt-2">Despacho a todo Chile · Pago seguro con Mercado Pago.</p>
          <p className="mt-6 text-xs text-ink/40">
            © {new Date().getFullYear()} {STORE.name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {showBottomBar && <BottomBar />}
      <CartDrawer />
    </div>
  );
}
