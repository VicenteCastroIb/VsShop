import { useState } from 'react';
import { STORE, formatCLP, REGIONES_CHILE } from '../lib/store';
import { useCart } from '../lib/cart';
import { track } from '../lib/fpixel';

export default function CartDrawer() {
  const { open, setOpen, order, setQty, remove, items } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: REGIONES_CHILE[6], // Metropolitana por defecto
  });

  const empty = order.lines.length === 0;

  function updateForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function goToCheckout() {
    setErrorMsg('');
    if (empty) return;
    setCheckout(true);
    track('InitiateCheckout', {
      content_ids: order.lines.map((l) => l.id),
      content_type: 'product',
      num_items: order.totalUnits,
      value: order.total,
      currency: STORE.currency,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (empty) {
      setErrorMsg('Tu carrito está vacío.');
      return;
    }
    if (!form.nombre || !form.telefono || !form.direccion || !form.comuna || !form.region) {
      setErrorMsg('Completa los campos obligatorios (*).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: items, payer: form }),
      });
      const data = await res.json();

      if (!res.ok || !data.init_point) {
        setErrorMsg(data.error || 'No se pudo iniciar el pago. Intenta nuevamente.');
        setSubmitting(false);
        return;
      }
      window.location.href = data.init_point;
    } catch (err) {
      setErrorMsg('Hubo un problema de conexión. Intenta nuevamente.');
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Fondo oscuro */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Carrito"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-2xl uppercase">
            {checkout ? 'Datos y pago' : 'Tu carrito'}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
            className="text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-ink/50">
              <p className="font-display text-3xl uppercase text-ink/30">Vacío</p>
              <p className="mt-2 text-sm">
                Aún no hay productos cargados en la tienda. Vuelve pronto.
              </p>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {order.lines.map((line) => (
                  <li key={line.id} className="flex items-center gap-3 border border-ink/10 bg-white p-2">
                    <div className="h-14 w-14 shrink-0 overflow-hidden bg-paper">
                      {line.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-ink/30">
                          {STORE.name}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{line.name}</p>
                      <p className="text-xs text-ink/50">
                        {STORE.currencySymbol}
                        {formatCLP(line.unitPrice)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(line.id, line.quantity - 1)}
                        className="h-7 w-7 border border-ink/20"
                        aria-label="Restar"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-bold tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.id, line.quantity + 1)}
                        className="h-7 w-7 border border-ink/20"
                        aria-label="Sumar"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      className="text-ink/40 hover:text-ink"
                      aria-label="Quitar"
                    >
                      🗑
                    </button>
                  </li>
                ))}
              </ul>

              {checkout && (
                <form onSubmit={handleSubmit} className="mt-5 space-y-3" id="checkout-form">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nombre*" value={form.nombre} onChange={(v) => updateForm('nombre', v)} required />
                    <Field label="Apellido" value={form.apellido} onChange={(v) => updateForm('apellido', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Email" type="email" value={form.email} onChange={(v) => updateForm('email', v)} />
                    <Field label="Teléfono*" value={form.telefono} onChange={(v) => updateForm('telefono', v)} required />
                  </div>
                  <Field label="Dirección (calle y número)*" value={form.direccion} onChange={(v) => updateForm('direccion', v)} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Comuna*" value={form.comuna} onChange={(v) => updateForm('comuna', v)} required />
                    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-ink/70">
                      Región*
                      <select
                        value={form.region}
                        onChange={(e) => updateForm('region', e.target.value)}
                        required
                        className="border border-ink/20 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink"
                      >
                        {REGIONES_CHILE.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </form>
              )}

              {errorMsg && <p className="mt-3 text-sm font-semibold text-accent">{errorMsg}</p>}
            </>
          )}
        </div>

        {!empty && (
          <div className="border-t border-ink/10 px-5 py-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-wide text-ink/60">
                Total · {order.totalUnits} {order.totalUnits === 1 ? 'unidad' : 'unidades'}
              </span>
              <strong className="font-display text-2xl">
                {STORE.currencySymbol}
                {formatCLP(order.total)}
              </strong>
            </div>
            {checkout ? (
              <button type="submit" form="checkout-form" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Redirigiendo a Mercado Pago…' : `Pagar ${STORE.currencySymbol}${formatCLP(order.total)}`}
              </button>
            ) : (
              <button type="button" onClick={goToCheckout} className="btn-primary w-full">
                Continuar compra →
              </button>
            )}
            <p className="mt-2 text-center text-[11px] text-ink/50">
              Despacho a todo Chile · Pago seguro con Mercado Pago
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-ink/70">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border border-ink/20 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink"
      />
    </label>
  );
}
