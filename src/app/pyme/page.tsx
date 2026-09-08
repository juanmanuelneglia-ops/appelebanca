import type { Metadata } from "next";
import { PymeLanding } from "@/components/public/PymeLanding";

export const metadata: Metadata = {
  title: "Banca PYME Bancoagrícola",
  description:
    "Soluciones de financiamiento, pagos e inversión para tu Pyme.",
};

export default function PymePage() {
  return <PymeLanding />;
}
