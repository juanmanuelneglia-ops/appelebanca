import type { Metadata } from "next";
import { PreferencialLanding } from "@/components/public/PreferencialLanding";

export const metadata: Metadata = {
  title: "Banca Preferencial Bancoagrícola",
  description:
    "Experiencia exclusiva, ejecutivo dedicado y beneficios Preferenciales.",
};

export default function PreferencialPage() {
  return <PreferencialLanding />;
}
