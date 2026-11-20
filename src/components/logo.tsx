import Image from "next/image";

// Marca do Niver: a cabeça do Leo, o leãozinho festeiro, ao lado do nome.
export function LogoMark({ className = "size-[1.6em]" }: { className?: string }) {
  return <Image src="/brand/b/leao-cabeca.png" alt="" width={512} height={512} className={`shrink-0 ${className}`} />;
}

export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-semibold text-ink ${className}`}>
      <LogoMark />
      Niver
    </span>
  );
}
