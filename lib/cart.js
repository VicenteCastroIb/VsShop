import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { buildOrder, findProduct } from './store';
import { track } from './fpixel';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // items = { [productId]: cantidad }
  const [items, setItems] = useState({});
  const [open, setOpen] = useState(false);

  const setQty = useCallback((id, qty) => {
    setItems((prev) => {
      const next = { ...prev };
      const q = Math.max(0, parseInt(qty, 10) || 0);
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  }, []);

  const add = useCallback(
    (id, qty = 1) => {
      const product = findProduct(id);
      if (!product) return;
      setItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + qty }));
      setOpen(true);
      track('AddToCart', {
        content_name: product.name,
        content_ids: [id],
        content_type: 'product',
        value: product.price,
        currency: product.currency || 'CLP',
      });
    },
    [],
  );

  const remove = useCallback((id) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const order = useMemo(() => buildOrder(items), [items]);

  const value = useMemo(
    () => ({
      items,
      order,
      count: order.totalUnits,
      open,
      setOpen,
      add,
      remove,
      setQty,
      clear,
    }),
    [items, order, open, add, remove, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
