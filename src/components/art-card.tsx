import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type Tone = "leaf" | "sun" | "muted";

const DOTS: Record<Tone, string> = {
  leaf: "bg-emerald-400",
  sun: "bg-amber-300",
  muted: "bg-white/60",
};

// Cartão de arte usado nas galerias de convites e de modelos.
export function ArtCard({
  href,
  imageUrl,
  title,
  subtitle,
  badge,
  children,
}: {
  href: string;
  imageUrl: string | null;
  title: string;
  subtitle?: string;
  badge?: { label: string; tone: Tone };
  children?: ReactNode;
}) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className="relative block aspect-[9/14] overflow-hidden rounded-3xl bg-sunken shadow-soft ring-1 ring-line transition duration-300 ease-soft hover:-translate-y-1 hover:shadow-lift"
      >
        {imageUrl ? (
          // A galeria pede uma miniatura do tamanho do cartão, não a arte original.
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
            className="object-cover object-top transition duration-700 ease-soft group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-linear-to-br from-sun/50 via-coral/30 to-coral/60">
            <span className="font-display text-7xl font-semibold text-white/80">
              {title.trim().charAt(0).toUpperCase() || "?"}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/55 to-transparent px-4 pt-20 pb-4 text-white">
          <p className="truncate font-display text-xl font-semibold">{title}</p>
          {subtitle && <p className="truncate text-sm text-white/80">{subtitle}</p>}
        </div>
        {badge && (
          <span className="badge absolute top-3 left-3 bg-black/50 text-white backdrop-blur-md">
            <span className={`size-1.5 rounded-full ${DOTS[badge.tone]}`} />
            {badge.label}
          </span>
        )}
      </Link>
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="panel flex animate-rise flex-col items-center px-6 py-14 text-center">
      <span className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-coral/10 text-coral">
        {icon}
      </span>
      <p className="section-title">{title}</p>
      <p className="mt-2 max-w-sm text-muted">{children}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
