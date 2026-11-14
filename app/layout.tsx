import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TEAZ — Seu estilo, seu universo",
  description: "Descubra peças, encontre combinações e transforme seu guarda-roupa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}