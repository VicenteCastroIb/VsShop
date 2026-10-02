import { useEffect, useState } from 'react';
import { STORE, MAX_QTY, REGIONES_CHILE, money, describeUnits } from '../lib/store';
import { useCart } from '../lib/cart';
import { track } from '../lib/fpixel';
import { CloseIcon, LockIcon, TrashIcon } from './Icons';

export default function CartDrawer() {
  const { open, setOpen, step, setStep, order, cart, setQty, remove } = useCart();
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
  const checkout = step === 'checkout' && !empty;

  // Bloquea el scroll del fondo mientras el carrito está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // InitiateCheckout una vez por cada entrada al formulario de pago.
  useEffect(() => {
    if (!open || !checkout) return;
    track('InitiateCheckout', {
      content_ids: order.lines.map((l) => l.id),
      content_type: 'product',
      num_items: order.totalUnits,
      value: order.total,
      currency: STORE.currency,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, checkout]);

  function updateForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
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
        body: JSON.stringify({ cart, payer: form }),
      });
      const data = await res.json().catch(() => ({}));

      // Solo redirigimos a una URL https de Mercado Pago.
      const url = typeof data.init_point === 'string' ? data.init_point : '';
      if (!res.ok || !/^https:\/\/([a-z0-9-]+\.)*mercadopago\.[a-z.]+\//i.test(url)) {
        setErrorMsg(data.error || 'No se pudo iniciar el pago. Intenta nuevamente.');
        setSubmitting(false);
        return;
      }
      window.location.href = url;
    } catch (err) {
      setErrorMsg('Hubo un problema de conexión. Intenta nuevamente.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/70 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-night shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'invisible translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-xl font-bold">{checkout ? 'Datos y pago' : 'Tu carrito'}</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded bg-surface"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-ivory/40">Tu carrito está vacío</p>
              <p className="mt-2 text-sm text-muted">Elige una joya y aparecerá aquí.</p>
              <button type="button" onClick={() => setOpen(false)} className="btn-outline mt-6">
                Ver productos
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {order.lines.map((line) => {
                  const options = describeUnits(line);
                  return (
                    <li key={line.key} className="flex gap-3 rounded-xl border border-white/10 bg-surface p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={line.image}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-lg bg-tile object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug">{line.name}</p>
                        {line.kind === 'addon' && (
                          <p className="text-xs font-semibold text-gold">Extra con descuento</p>
                        )}
                        {options && <p className="mt-0.5 break-words text-xs text-muted">{options}</p>}

                        <div className="mt-2 flex items-center justify-between gap-2">
                          {line.kind === 'main' ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setQty(line.id, line.quantity - 1)}
                                className="h-8 w-8 rounded border border-white/20 text-lg leading-none"
                                aria-label={`Restar una unidad de ${line.name}`}
                              >
                                −
                              </button>
                              <span className="w-5 text-center text-sm font-bold tabular-nums">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQty(line.id, line.quantity + 1)}
                                disabled={line.quantity >= MAX_QTY}
                                className="h-8 w-8 rounded border border-white/20 text-lg leading-none disabled:opacity-30"
                                aria-label={`Sumar una unidad de ${line.name}`}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted">1 unidad</span>
                          )}
                          <div className="text-right">
                            <p className="text-sm font-bold tabular-nums text-gold">{money(line.subtotal)}</p>
                            {line.regular > line.subtotal && (
                              <p className="text-xs tabular-nums text-muted line-through">{money(line.regular)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="self-start p-1 text-muted hover:text-ivory"
                        aria-label={`Quitar ${line.name}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {checkout && (
                <form onSubmit={handleSubmit} className="mt-5 space-y-3" id="checkout-form">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nombre*" value={form.nombre} onChange={(v) => updateForm('nombre', v)} required autoComplete="given-name" maxLength={60} />
                    <Field label="Apellido" value={form.apellido} onChange={(v) => updateForm('apellido', v)} autoComplete="family-name" maxLength={60} />
                  </div>
                  <Field label="Teléfono*" type="tel" inputMode="tel" value={form.telefono} onChange={(v) => updateForm('telefono', v)} required autoComplete="tel" maxLength={20} placeholder="+56 9 1234 5678" />
                  <Field label="Email" type="email" inputMode="email" value={form.email} onChange={(v) => updateForm('email', v)} autoComplete="email" maxLength={120} />
                  <Field label="Dirección (calle y número)*" value={form.direccion} onChange={(v) => updateForm('direccion', v)} required autoComplete="street-address" maxLength={160} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Comuna*" value={form.comuna} onChange={(v) => updateForm('comuna', v)} required autoComplete="address-level2" maxLength={60} />
                    <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
                      Región*
                      <select
                        value={form.region}
                        onChange={(e) => updateForm('region', e.target.value)}
                        required
                        className="field font-normal"
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

              {errorMsg && (
                <p role="alert" className="mt-3 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300">
                  {errorMsg}
                </p>
              )}
            </>
          )}
        </div>

        {!empty && (
          <div className="safe-bottom border-t border-white/10 bg-surface px-5 pt-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm text-muted">
                Total · {order.totalUnits} {order.totalUnits === 1 ? 'unidad' : 'unidades'}
              </span>
              <strong className="text-2xl font-bold tabular-nums text-gold">{money(order.total)}</strong>
            </div>
            {checkout ? (
              <button type="submit" form="checkout-form" disabled={submitting} className="btn-gold w-full">
                {submitting ? 'Redirigiendo a Mercado Pago…' : `Pagar ${money(order.total)}`}
              </button>
            ) : (
              <button type="button" onClick={() => setStep('checkout')} className="btn-gold w-full">
                Continuar compra
              </button>
            )}
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
              <LockIcon className="h-3.5 w-3.5" /> Pago seguro con Mercado Pago · {STORE.announcement}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function Field({ label, value, onChange, type = 'text', required = false, ...rest }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="field font-normal"
        {...rest}
      />
    </label>
  );
}
