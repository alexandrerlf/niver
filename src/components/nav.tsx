"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";

const LINKS: { href: string; label: string; icon: IconName; match: string[] }[] = [
  { href: "/", label: "Convites", icon: "mail", match: ["/convites", "/novo"] },
  { href: "/admin/modelos", label: "Modelos", icon: "grid", match: ["/admin/modelos"] },
  { href: "/admin/clientes", label: "Clientes", icon: "users", match: ["/admin/clientes"] },
];

function useActive() {
  const pathname = usePathname();
  return (link: (typeof LINKS)[number]) =>
    pathname === link.href || link.match.some((prefix) => pathname.startsWith(prefix));
}

// Só o admin tem mais de um destino. No computador a navegação fica no topo.
export function TopNav() {
  const active = useActive();
  return (
    <nav
      aria-label="Principal"
      className="hidden items-center gap-1 rounded-full border border-line bg-card/70 p-1 sm:flex"
    >
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active(link) ? "page" : undefined}
          className="flex min-h-9 items-center rounded-full px-4 text-sm font-semibold text-muted transition duration-200 hover:text-ink aria-[current]:bg-ink aria-[current]:text-paper"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

// No celular vira uma barra flutuante ao alcance do polegar.
export function BottomNav() {
  const active = useActive();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto flex w-fit items-center gap-1 rounded-full border border-line bg-card/85 p-1.5 shadow-lift backdrop-blur-xl sm:hidden"
    >
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active(link) ? "page" : undefined}
          className="flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted transition duration-200 aria-[current]:bg-ink aria-[current]:text-paper"
        >
          <Icon name={link.icon} className="size-[18px]" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
