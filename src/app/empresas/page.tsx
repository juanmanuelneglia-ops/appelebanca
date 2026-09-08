import type { Metadata } from "next";
import { EmpresasLanding } from "@/components/public/EmpresasLanding";

export const metadata: Metadata = {
  title: "Empresas y Gobierno | Bancoagrícola",
  description:
    "Portafolio integral de financiamiento, cash management y canales digitales para empresas.",
};

export default function EmpresasPage() {
  return <EmpresasLanding />;
}
