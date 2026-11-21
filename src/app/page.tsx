import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { createClient, getUserId } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { absolute: "Niver: convite de aniversário infantil do jeitinho que as crianças amam" },
  description:
    "Crie convites de aniversário interativos, escolha um tema e deixe os convidados confirmarem presença pelo próprio link.",
  openGraph: {
    title: "Niver: convite de aniversário infantil do jeitinho que as crianças amam",
    description: "Convite com confirmação de presença, mapa e sugestões de presente num link só.",
    images: [{ url: "/brand/b/og-leao.png", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
};

// Primeira tela: a vitrine para quem não está logado. Quem já entrou vai direto aos convites.
export default async function HomePage() {
  const supabase = await createClient();
  if (await getUserId(supabase)) redirect("/convites");
  // Depoimentos de exemplo só nas prévias e no ambiente local, nunca em produção.
  return <LandingPage showPlaceholders={process.env.VERCEL_ENV !== "production"} />;
}
