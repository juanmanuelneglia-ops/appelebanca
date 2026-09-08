"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import {
  PREF_BENEFITS,
  PREF_CARDS,
  PREF_CENTROS,
  PREF_LIFESTYLE,
  PREF_NIVELES,
  PREF_SOLUTIONS,
} from "@/lib/preferencial";

export function PreferencialLanding() {
  const [benefitIndex, setBenefitIndex] = useState(0);
  const [lifestyleId, setLifestyleId] = useState(PREF_LIFESTYLE[1].id);
  const [nivelId, setNivelId] = useState(PREF_NIVELES[0].id);
  const [solutionId, setSolutionId] = useState(PREF_SOLUTIONS[0].id);

  const benefitPairs = Math.ceil(PREF_BENEFITS.length / 2);
  const benefitA = PREF_BENEFITS[benefitIndex * 2];
  const benefitB = PREF_BENEFITS[benefitIndex * 2 + 1];

  const lifestyle =
    PREF_LIFESTYLE.find((i) => i.id === lifestyleId) ?? PREF_LIFESTYLE[0];
  const nivel = PREF_NIVELES.find((i) => i.id === nivelId) ?? PREF_NIVELES[0];
  const solution =
    PREF_SOLUTIONS.find((i) => i.id === solutionId) ?? PREF_SOLUTIONS[0];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        {/* Hero oscuro */}
        <section className="bg-[#2c2a29] text-white">
          <div className="ba-container grid items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded bg-white px-3 py-1.5 text-[13px] font-bold text-[#1a1b1a]">
                <Image
                  src="/images/preferencial/ico-badge.png"
                  alt=""
                  width={16}
                  height={16}
                  className="object-contain"
                />
                Preferencial
              </span>
              <p className="mt-5 text-[15px] font-light text-white/80">
                Bienvenido a Banca Preferencial
              </p>
              <h1 className="mt-2 max-w-md text-[34px] font-bold leading-tight md:text-[42px]">
                aquí comienza tu experiencia exclusiva
              </h1>
              <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-white/75">
                Haz crecer tu patrimonio con un portafolio pensado para ti, vive
                experiencias únicas y disfruta de una atención cercana y
                personalizada
              </p>
            </div>
            <div className="relative mx-auto aspect-[1250/892] w-full max-w-[560px] overflow-hidden">
              <Image
                src="/images/preferencial/hero.jpg"
                alt="Banca Preferencial Bancoagrícola"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 560px"
                priority
              />
            </div>
          </div>
        </section>

        {/* Beneficios carousel */}
        <section className="bg-white py-12">
          <div className="ba-container relative px-4">
            <h2 className="text-center text-[26px] font-bold text-[#1a1b1a] md:text-[28px]">
              Conoce todos los beneficios con los que cuentas
            </h2>

            <div className="relative mx-auto mt-10 max-w-4xl">
              <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                {benefitA ? (
                  <div className="px-2 text-center md:text-left">
                    <Image
                      src={benefitA.icon}
                      alt=""
                      width={56}
                      height={56}
                      className="mx-auto object-contain md:mx-0"
                    />
                    <h3 className="mt-4 text-[20px] font-bold text-[#1a1b1a]">
                      {benefitA.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-[#555]">
                      {benefitA.description}
                    </p>
                  </div>
                ) : null}
                {benefitB ? (
                  <div className="relative px-2 text-center md:border-l md:border-[#ddd] md:pl-10 md:text-left">
                    <Image
                      src={benefitB.icon}
                      alt=""
                      width={56}
                      height={56}
                      className="mx-auto object-contain md:mx-0"
                    />
                    <h3 className="mt-4 text-[20px] font-bold text-[#1a1b1a]">
                      {benefitB.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-[#555]">
                      {benefitB.description}
                    </p>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                aria-label="Anterior"
                onClick={() =>
                  setBenefitIndex(
                    (i) => (i - 1 + benefitPairs) % benefitPairs,
                  )
                }
                className="absolute left-0 top-1/2 z-10 hidden h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fdda24] text-[#1a1b1a] md:grid"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                onClick={() =>
                  setBenefitIndex((i) => (i + 1) % benefitPairs)
                }
                className="absolute right-0 top-1/2 z-10 hidden h-[44px] w-[44px] translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fdda24] text-[#1a1b1a] md:grid"
              >
                <Chevron dir="right" />
              </button>
            </div>

            <ol className="mt-8 flex list-none justify-center gap-2 p-0">
              {Array.from({ length: benefitPairs }).map((_, i) => (
                <li key={i}>
                  <button
                    type="button"
                    aria-label={`Beneficios ${i + 1}`}
                    onClick={() => setBenefitIndex(i)}
                    className={`block h-[3px] w-10 ${
                      i === benefitIndex ? "bg-[#fdda24]" : "bg-[#2c2a29]"
                    }`}
                  />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tarjetas */}
        <section className="bg-[#2c2a29] py-14 text-white">
          <div className="ba-container px-4 text-center">
            <h2 className="text-[30px] font-bold md:text-[34px]">
              ¿Aún no la tienes?
            </h2>
            <p className="mt-2 text-[16px] font-light text-white/80">
              ¡Solicítala hoy y empieza a disfrutar de tus beneficios!
            </p>

            <div className="mt-10 grid gap-5 text-left md:grid-cols-3">
              {PREF_CARDS.map((card) => (
                <article
                  key={card.title}
                  className="flex flex-col overflow-hidden rounded-[14px] bg-white text-[#1a1b1a]"
                >
                  <div className="relative flex h-[180px] items-center justify-center bg-[#f7f7f7] p-6">
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={220}
                      height={140}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[20px] font-bold">{card.title}</h3>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[#555]">
                      {card.description}
                    </p>
                    <div className="mt-5 flex flex-col gap-2">
                      <Link
                        href={card.href}
                        className="inline-flex justify-center rounded-full bg-[#fdda24] px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a]"
                      >
                        Solicitar
                      </Link>
                      <Link
                        href={card.href}
                        className="inline-flex items-center justify-center gap-1 rounded-full border border-[#ddd] px-5 py-2 text-[13px] font-semibold text-[#555]"
                      >
                        Descubre más
                        <span aria-hidden>›</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Solo a ti / lifestyle tabs */}
        <section className="bg-white py-12">
          <div className="ba-container px-4">
            <h2 className="text-[28px] font-bold text-[#1a1b1a]">Solo a ti</h2>
            <p className="mt-2 text-[15px] text-[#555]">
              Disfruta de momentos y espacios exclusivos por ser preferencial.
            </p>

            <div
              className="mt-7 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Estilo de vida Preferencial"
            >
              {PREF_LIFESTYLE.map((item) => {
                const active = item.id === lifestyleId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setLifestyleId(item.id)}
                    className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                      active
                        ? "bg-[#fdda24] text-[#1a1b1a]"
                        : "bg-[#f0f0f0] text-[#1a1b1a] hover:bg-[#e8e8e8]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid items-center gap-8 overflow-hidden rounded-[12px] bg-[#f7f7f7] md:grid-cols-2">
              <div className="relative min-h-[260px]">
                <Image
                  src={lifestyle.image}
                  alt={lifestyle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="px-6 py-8 md:pr-10">
                <h3 className="text-[24px] font-bold text-[#1a1b1a]">
                  {lifestyle.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[#555]">
                  {lifestyle.description}
                </p>
                <Link
                  href="/promociones"
                  className="mt-6 inline-flex rounded-full bg-[#fdda24] px-6 py-2.5 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a]"
                >
                  Quiero conocer más
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Niveles */}
        <section className="bg-[#f4f4f4] py-12">
          <div className="ba-container px-4">
            <h2 className="text-[28px] font-bold text-[#1a1b1a]">
              Somos tu aliado en todo momento
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] text-[#555]">
              Contamos con cuatro formas de relacionarnos, pensadas
              especialmente para ti. Solo a ti te atiende nuestro equipo experto
              de forma especial, ágil y personalizada.
            </p>

            <div
              className="mt-7 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Niveles Preferencial"
            >
              {PREF_NIVELES.map((item) => {
                const active = item.id === nivelId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setNivelId(item.id)}
                    className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                      active
                        ? "bg-[#2c2a29] text-white"
                        : "bg-white text-[#1a1b1a] hover:bg-[#e8e8e8]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
              <div className="relative min-h-[280px] overflow-hidden rounded-[12px]">
                <Image
                  src={nivel.image}
                  alt={nivel.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="text-[26px] font-bold text-[#1a1b1a]">
                  {nivel.label}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[#555]">
                  {nivel.description}
                </p>
                <p className="mt-4 text-[14px] font-semibold text-[#1a1b1a]">
                  Línea exclusiva: 2527-6101
                </p>
                <Link
                  href="/#contacto"
                  className="mt-6 inline-flex rounded-full border border-[#1a1b1a] px-6 py-2.5 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a] hover:bg-[#1a1b1a] hover:text-white"
                >
                  Conoce más
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Atención */}
        <section className="bg-white py-12">
          <div className="ba-container grid gap-8 px-4 md:grid-cols-2">
            <article className="rounded-[12px] border border-[#eee] bg-[#fafafa] p-6">
              <h3 className="text-[20px] font-bold text-[#1a1b1a]">
                Atención especial
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[#555]">
                Comunícate con tu ejecutivo, tu Centro de Atención Preferencial
                o red de Agencias con prioridad de atención en caja.
              </p>
            </article>
            <article className="rounded-[12px] border border-[#eee] bg-[#fafafa] p-6">
              <h3 className="text-[20px] font-bold text-[#1a1b1a]">
                Centros de Atención Preferencial
              </h3>
              <p className="mt-2 text-[13px] text-[#777]">
                Para clientes nivel Plus, Premium y Banca Privada
              </p>
              <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {PREF_CENTROS.map((c) => (
                  <li key={c} className="text-[14px] text-[#1a1b1a]">
                    {c}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* Soluciones */}
        <section
          className="relative overflow-hidden py-14 text-white"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(44,42,41,0.92), rgba(44,42,41,0.75)), url(/images/preferencial/soluciones.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="ba-container px-4">
            <h2 className="text-[28px] font-bold md:text-[32px]">
              Soluciones pensadas especialmente para ti
            </h2>
            <p className="mt-3 text-[15px] text-white/80">
              Selecciona una de las categorías para encontrar tu solución ideal:
            </p>

            <div
              className="mt-7 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Soluciones Preferencial"
            >
              {PREF_SOLUTIONS.map((cat) => {
                const active = cat.id === solutionId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSolutionId(cat.id)}
                    className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                      active
                        ? "bg-[#fdda24] text-[#1a1b1a]"
                        : "bg-white/15 text-white hover:bg-white/25"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {solution.products.map((product) => (
                <Link
                  key={product.title}
                  href={product.href}
                  className="rounded-[10px] bg-white/95 p-4 text-[15px] font-semibold text-[#1a1b1a] underline-offset-2 hover:bg-white hover:underline"
                >
                  {product.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <a
        href="/login"
        aria-label="Chat en línea"
        className="fixed bottom-5 right-5 z-50 grid h-[58px] w-[58px] place-items-center rounded-full border-[3px] border-white bg-[#fdda24] shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-[#1a1b1a]"
          fill="currentColor"
        >
          <path d="M12 3a7 7 0 00-7 7v1.5A3.5 3.5 0 008.5 15H9v2.2A5.8 5.8 0 0014.8 23h.2v-2h-.2A3.8 3.8 0 0111 17.2V15h1.5A3.5 3.5 0 0016 11.5V10a7 7 0 00-7-7zm-5 8.5V10a5 5 0 1110 0v1.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 11.5z" />
        </svg>
      </a>
    </>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      {dir === "left" ? (
        <path d="M14.5 5.5L8 12l6.5 6.5" />
      ) : (
        <path d="M9.5 5.5L16 12l-6.5 6.5" />
      )}
    </svg>
  );
}
