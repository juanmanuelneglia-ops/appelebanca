import Link from "next/link";
import { HOME_PRODUCTS } from "@/lib/home";

export function ProductsGrid() {
  return (
    <section className="bg-[#f7f7f7] px-4 py-12 sm:px-6">
      <div className="ba-container">
        <h2 className="text-[28px] font-bold text-[#1a1a1a] md:text-[28px]">
          Descubre nuestras soluciones
        </h2>
        <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_PRODUCTS.map((product) => (
            <article key={product.title} className="border-t border-[#ddd] pt-4">
              <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                <Link href={product.href} className="hover:underline">
                  {product.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#555]">
                {product.description}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/promociones"
            className="inline-flex rounded-full border border-[#1a1a1a] px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white"
          >
            Conoce más
          </Link>
        </div>
      </div>
    </section>
  );
}
