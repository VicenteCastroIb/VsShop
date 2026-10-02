// Íconos de línea propios (SVG inline, sin dependencias).
function Svg({ children, className = 'h-6 w-6', strokeWidth = 1.6, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const MenuIcon = (p) => (
  <Svg {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Svg>
);

export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Svg>
);

export const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
  </Svg>
);

export const BagIcon = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l1 13H4L5 8z" />
    <path d="M9 8V6a3 3 0 016 0v2" />
  </Svg>
);

export const ChevronLeft = (p) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);

export const ChevronRight = (p) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);

export const ChevronDown = (p) => (
  <Svg {...p}>
    <path d="M5 9l7 7 7-7" />
  </Svg>
);

export const CheckIcon = (p) => (
  <Svg strokeWidth={2.4} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const CrossIcon = (p) => (
  <Svg strokeWidth={2.4} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const TagIcon = (p) => (
  <Svg {...p}>
    <path d="M3 12V4h8l10 10-8 8L3 12z" fill="currentColor" stroke="none" />
    <circle cx="7.5" cy="8.5" r="1.4" fill="#0a0a0b" stroke="none" />
  </Svg>
);

export const HelpIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.3M12 17h.01" />
  </Svg>
);

export const StarOutlineIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8L12 3z" />
  </Svg>
);

export const TruckIcon = (p) => (
  <Svg {...p}>
    <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </Svg>
);

export const InfoIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5h.01" />
  </Svg>
);

export const BoxIcon = (p) => (
  <Svg {...p}>
    <path d="M4 5h16v14H4z" />
    <path d="M9 5v6l3-1.5L15 11V5" />
  </Svg>
);

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
  </Svg>
);

export const LockIcon = (p) => (
  <Svg {...p}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 018 0v3" />
  </Svg>
);

// Burbuja de chat genérica para el botón de WhatsApp.
export const ChatIcon = (p) => (
  <Svg strokeWidth={1.8} {...p}>
    <path d="M12 3a9 9 0 00-7.7 13.6L3 21l4.6-1.2A9 9 0 1012 3z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={2.4} />
  </Svg>
);

export function Stars({ className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex gap-0.5 text-gold" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}
