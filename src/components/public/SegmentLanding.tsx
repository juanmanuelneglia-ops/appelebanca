import Link from "next/link";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import type { SegmentPageData } from "@/lib/segments";

export function SegmentLanding({ data }: { data: SegmentPageData }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <section
          className="text-white"
          style={{ background: data.heroTone }}
        >
          <div className="ba-container py-14 md:py-20">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#fdda24]">
              {data.eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl text-[2.2rem] font-bold leading-tight md:text-[3rem]">
              {data.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-[16px] font-light leading-relaxed text-white/90 md:text-[18px]">
              {data.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={data.ctaHref}
                className="inline-flex rounded-full bg-[#fdda24] px-6 py-2.5 text-[14px] font-bold text-[#1a1b1a]"
              >
                {data.ctaLabel}
              </Link>
              <Link
                href="/#contacto"
                className="inline-flex rounded-full border border-white px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-white hover:text-[#1a1b1a]"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f4f4] py-12">
          <div className="ba-container">
            <h2 className="text-[28px] font-bold text-[#1a1b1a]">
              {data.benefitsTitle}
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.benefits.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[10px] border border-[#e8e8e8] bg-white p-5 shadow-[0_0_5px_#eee]"
                >
                  <span className="mb-3 block h-1.5 w-10 bg-[#fdda24]" />
                  <h3 className="text-[18px] font-bold text-[#1a1b1a]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#555]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="ba-container">
            <h2 className="text-[28px] font-bold text-[#1a1b1a]">
              {data.cardsTitle}
            </h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {data.cards.map((card) => (
                <article
                  key={card.title}
                  className="flex flex-col rounded-[10px] border border-[#e8e8e8] bg-[#fafafa] p-6"
                >
                  <h3 className="text-[20px] font-bold text-[#1a1b1a]">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#555]">
                    {card.description}
                  </p>
                  <Link
                    href={card.href}
                    className="btn-ba-outline mt-6 w-fit"
                  >
                    {card.cta ?? "Conoce más"}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#2c2a29] py-12 text-white">
          <div className="ba-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-[28px] font-bold">{data.ctaTitle}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">
                {data.ctaBody}
              </p>
            </div>
            <Link
              href={data.ctaHref}
              className="inline-flex shrink-0 rounded-full bg-[#fdda24] px-7 py-3 text-[14px] font-bold text-[#1a1b1a]"
            >
              {data.ctaLabel}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <a
        href="/login"
        aria-label="Chat en línea"
        className="fixed bottom-5 right-5 z-50 grid h-[58px] w-[58px] place-items-center rounded-full border-[3px] border-white bg-[#fdda24] shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#1a1b1a]" fill="currentColor">
          <path d="M12 3a7 7 0 00-7 7v1.5A3.5 3.5 0 008.5 15H9v2.2A5.8 5.8 0 0014.8 23h.2v-2h-.2A3.8 3.8 0 0111 17.2V15h1.5A3.5 3.5 0 0016 11.5V10a7 7 0 00-7-7zm-5 8.5V10a5 5 0 1110 0v1.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 11.5z" />
        </svg>
      </a>
    </>
  );
}
