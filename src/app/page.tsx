import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import { QuickActions } from "@/components/public/QuickActions";
import { SolutionsSection } from "@/components/public/SolutionsSection";
import { NegociosBanner } from "@/components/public/NegociosBanner";
import { EasyLifeSection } from "@/components/public/EasyLifeSection";
import { ProductsGrid } from "@/components/public/ProductsGrid";
import { ExchangeRates } from "@/components/public/ExchangeRates";
import { ContactSection } from "@/components/public/ContactSection";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <HeroCarousel />
        <QuickActions />
        <SolutionsSection />
        <div id="preferencial" className="scroll-mt-24" />
        <NegociosBanner />
        <div id="empresas" className="scroll-mt-24" />
        <EasyLifeSection />
        <ProductsGrid />
        <ExchangeRates />
        <ContactSection />
      </main>
      <SiteFooter />

      {/* Chat FAB — yellow circle + headset like original */}
      <a
        href="/login"
        aria-label="Chat en línea"
        className="fixed bottom-5 right-5 z-50 grid h-[58px] w-[58px] place-items-center rounded-full border-[3px] border-white bg-[#fdda24] shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#1a1b1a]" fill="currentColor">
          <path d="M12 3a7 7 0 00-7 7v1.5A3.5 3.5 0 008.5 15H9v2.2A5.8 5.8 0 0014.8 23h.2v-2h-.2A3.8 3.8 0 0111 17.2V15h1.5A3.5 3.5 0 0016 11.5V10a7 7 0 00-7-7zm-5 8.5V10a5 5 0 1110 0v1.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 11.5z" />
        </svg>
      </a>
    </>
  );
}
