import { STORE } from '../lib/store';

// Cinta negra superior que se desplaza en loop hacia la izquierda,
// infinita y sin huecos.
//
// Cómo se logra que NUNCA quede sin texto:
//  - El contenido de "media pista" se repite lo suficiente para superar
//    el ancho de cualquier pantalla (REPEAT).
//  - Renderizamos esa media pista DOS veces dentro de .marquee-track y la
//    animación mueve la pista un -50%. Cuando la primera copia sale por la
//    izquierda, la segunda ya ocupa su lugar exacto → loop continuo.
export default function Marquee() {
  const items = STORE.marquee;

  // Repetimos los textos para que una "media pista" sea más ancha que la
  // pantalla incluso en monitores grandes (evita el hueco al final).
  const REPEAT = 4;
  const half = Array.from({ length: REPEAT }).flatMap(() => items);

  const Group = ({ ariaHidden }) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {half.map((text, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
            {text}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full overflow-hidden bg-ink text-white select-none">
      <div className="marquee-track py-2.5">
        <Group ariaHidden={false} />
        <Group ariaHidden />
      </div>
    </div>
  );
}
