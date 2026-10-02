import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { STORE, MAX_QTY, buildOrder, findProduct, normalizeUnits, priceForQty } from './store';
import { track } from './fpixel';

const CartContext = createContext(null);

const EMPTY = { lines: {}, addons: [] };

function clampQty(qty) {
  const n = parseInt(qty, 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(MAX_QTY, Math.max(0, n));
}

export function CartProvider({ children }) {
  // cart = { lines: { [productId]: { qty, units } }, addons: [productId] }
  const [cart, setCart] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  // 'cart' = resumen, 'checkout' = formulario de datos y pago.
  const [step, setStep] = useState('cart');

  const openCart = useCallback((nextStep = 'cart') => {
    setStep(nextStep);
    setOpen(true);
  }, []);

  // Fija (reemplaza) la línea de un producto: cantidad + opciones por unidad.
  const setLine = useCallback((id, qty, units) => {
    const product = findProduct(id);
    if (!product) return;
    const q = clampQty(qty);
    setCart((prev) => {
      const lines = { ...prev.lines };
      if (q <= 0) delete lines[id];
      else {
        const base = units || (prev.lines[id] && prev.lines[id].units);
        lines[id] = { qty: q, units: normalizeUnits(product, base, q) };
      }
      return { ...prev, lines };
    });
  }, []);

  const setQty = useCallback((id, qty) => setLine(id, qty), [setLine]);

  const setAddon = useCallback((id, on) => {
    setCart((prev) => {
      const rest = prev.addons.filter((a) => a !== id);
      return { ...prev, addons: on ? [...rest, id] : rest };
    });
  }, []);

  // "Comprar ahora": deja el pack elegido en el carrito y abre el pago.
  const buyNow = useCallback(
    (id, { qty = 1, units, addons = [] } = {}) => {
      const product = findProduct(id);
      if (!product) return;
      const q = Math.max(1, clampQty(qty));
      setCart((prev) => ({
        lines: { ...prev.lines, [id]: { qty: q, units: normalizeUnits(product, units, q) } },
        addons: Array.from(new Set([...prev.addons, ...addons])),
      }));
      track('AddToCart', {
        content_name: product.name,
        content_ids: [id],
        content_type: 'product',
        value: priceForQty(product, q),
        currency: STORE.currency,
      });
      openCart('checkout');
    },
    [openCart],
  );

  // key = productId (línea principal) o `${productId}__extra` (extra).
  const remove = useCallback((key) => {
    setCart((prev) => {
      if (key.endsWith('__extra')) {
        const id = key.slice(0, -'__extra'.length);
        return { ...prev, addons: prev.addons.filter((a) => a !== id) };
      }
      const lines = { ...prev.lines };
      delete lines[key];
      return { ...prev, lines };
    });
  }, []);

  const clear = useCallback(() => setCart(EMPTY), []);

  const order = useMemo(() => buildOrder(cart), [cart]);

  const value = useMemo(
    () => ({
      cart,
      order,
      count: order.totalUnits,
      open,
      setOpen,
      step,
      setStep,
      openCart,
      setLine,
      setQty,
      setAddon,
      buyNow,
      remove,
      clear,
    }),
    [cart, order, open, step, openCart, setLine, setQty, setAddon, buyNow, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
