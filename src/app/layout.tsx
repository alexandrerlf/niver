import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "Niver",
  description: "Crie convites de aniversário interativos.",
  applicationName: "Niver",
  appleWebApp: { capable: true, title: "Niver", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#e8552d",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
