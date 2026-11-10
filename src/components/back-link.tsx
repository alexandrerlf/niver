import Link from "next/link";
import { Icon } from "@/components/icons";

export function BackLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="-ml-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-muted transition duration-200 hover:bg-ink/5 hover:text-ink"
    >
      <Icon name="arrowLeft" className="size-4" />
      {children}
    </Link>
  );
}
