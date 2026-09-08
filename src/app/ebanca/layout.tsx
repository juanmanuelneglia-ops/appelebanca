import type { Metadata } from "next";
import { EbancaNav } from "@/components/ebanca/EbancaNav";
import { DEMO_USER } from "@/lib/data";

export const metadata: Metadata = {
  title: "E-Banca",
};

export default function EbancaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]">
      <EbancaNav userName={DEMO_USER.name} />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
