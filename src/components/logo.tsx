export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-semibold text-ink ${className}`}>
      <span className="inline-flex size-[1.45em] items-center justify-center rounded-[0.42em] bg-coral text-on-coral shadow-glow">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[0.85em]">
          <path d="m12 2.5 2.7 6.2 6.8.6-5.1 4.5 1.5 6.7-5.9-3.6-5.9 3.6 1.5-6.7-5.1-4.5 6.8-.6L12 2.5Z" />
        </svg>
      </span>
      Niver
    </span>
  );
}
