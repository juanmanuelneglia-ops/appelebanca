import Link from "next/link";
import { EXCHANGE_RATES } from "@/lib/home";

export function ExchangeRates() {
  return (
    <section className="bg-white px-0 py-12">
      <div className="ba-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[28px] font-light text-black">
            Tipo de cambio
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-[#1a1a1a] px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-[#1a1a1a]"
            >
              Ver todo el portafolio de moneda extranjera
            </button>
            <Link
              href="/#contacto"
              className="rounded-full bg-[#ffd200] px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-[#1a1a1a] transition hover:bg-[#f0c400]"
            >
              Cotizar tipo de cambio
            </Link>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXCHANGE_RATES.map((rate) => (
            <article
              key={rate.code}
              className="rounded-xl border border-[#e8e8e8] bg-[#fafafa] p-4"
            >
              <p className="text-sm font-semibold text-[#1a1a1a]">
                {rate.name} ({rate.code})
              </p>
              <div className="mt-3 flex justify-between text-sm text-[#555]">
                <span>
                  Compra:{" "}
                  <strong className="text-[#1a1a1a]">
                    {rate.buy.toFixed(4)}
                  </strong>
                </span>
                <span>
                  Venta:{" "}
                  <strong className="text-[#1a1a1a]">
                    {rate.sell.toFixed(4)}
                  </strong>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
