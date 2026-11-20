import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: { default: "Niver", template: "%s · Niver" },
  description: "Crie convites de aniversário interativos.",
  applicationName: "Niver",
  appleWebApp: { capable: true, title: "Niver", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaff" },
    { media: "(prefers-color-scheme: dark)", color: "#15102a" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
