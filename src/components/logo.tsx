// Marca do Niver: o rosto do Nino, o envelope festeiro, ao lado do nome.
export function LogoMark({ className = "size-[1.45em]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={`shrink-0 rounded-[28%] shadow-glow ${className}`}>
      <rect width="512" height="512" fill="#c7401d" />
      <g transform="translate(256 286)">
        <rect x="-150" y="-92" width="300" height="200" rx="38" fill="#fffaf2" stroke="#3a2418" strokeWidth="14" />
        <path d="M-144 -76 L0 -176 L144 -76 Z" fill="#f6b93b" stroke="#3a2418" strokeWidth="14" strokeLinejoin="round" />
        <ellipse cx="-48" cy="-6" rx="22" ry="27" fill="#3a2418" />
        <ellipse cx="48" cy="-6" rx="22" ry="27" fill="#3a2418" />
        <path d="M-30 38 Q0 76 30 38 Z" fill="#c7401d" stroke="#3a2418" strokeWidth="10" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-semibold text-ink ${className}`}>
      <LogoMark />
      Niver
    </span>
  );
}
