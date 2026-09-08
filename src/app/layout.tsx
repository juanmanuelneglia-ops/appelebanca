import type { Metadata, Viewport } from "next";
import { Open_Sans, Nunito } from "next/font/google";
import { HideNextDevBadge } from "@/components/HideNextDevBadge";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bancoagrícola - Productos financieros para personas y empresas",
  description:
    "Soluciones diseñadas para ti. Con créditos personales, tarjetas de crédito, cuentas de ahorro, seguros y un amplia gama de servicios financieros.",
  icons: { icon: "/images/favicon.png" },
  appleWebApp: {
    capable: true,
    title: "e-banca Personas",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${openSans.variable} ${nunito.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans text-[#1a1b1a] antialiased">
        <HideNextDevBadge />
        {children}
      </body>
    </html>
  );
}
