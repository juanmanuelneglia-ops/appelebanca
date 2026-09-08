import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { Button } from "@/components/ui/Button";
import { getProduct } from "@/lib/data";

type Props = {
  slug: string;
};

export function productMetadata(slug: string): Metadata {
  const product = getProduct(slug);
  return {
    title: product?.title ?? "Producto",
    description: product?.description,
  };
}

export function ProductPage({ slug }: Props) {
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-ba-line bg-[linear-gradient(135deg,#111_0%,#1d1d1d_45%,#2a2408_100%)] text-white">
          <div className="absolute inset-0 opacity-40 hero-lights" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ba-yellow">
              Personas
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl animate-fade-up">
              {product.headline}
            </h1>
            <p className="mt-4 max-w-xl text-white/75 animate-fade-up-delay">
              {product.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/login">Abrir en E-Banca</Button>
              <Button href="/" variant="outline">
                Volver al inicio
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-ba-ink">
            ¿Por qué {product.title.toLowerCase()} con nosotros?
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {product.points.map((point) => (
              <li
                key={point}
                className="border border-ba-line bg-white p-5 text-sm text-ba-muted"
              >
                <span className="mb-3 block h-1.5 w-10 bg-ba-yellow" />
                {point}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
