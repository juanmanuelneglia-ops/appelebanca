"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import {
  PYME_CATEGORIES,
  PYME_COURSES,
  PYME_HERO,
} from "@/lib/pyme";

export function PymeLanding() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [categoryId, setCategoryId] = useState(PYME_CATEGORIES[0].id);
  const [courseId, setCourseId] = useState(PYME_COURSES[0].id);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((c) => (c + 1) % PYME_HERO.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  const slide = PYME_HERO[heroIndex];
  const category =
    PYME_CATEGORIES.find((c) => c.id === categoryId) ?? PYME_CATEGORIES[0];
  const course =
    PYME_COURSES.find((c) => c.id === courseId) ?? PYME_COURSES[0];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        {/* Hero — texto izq / foto der (como el original) */}
        <section className="bg-white pt-3">
          <div className="ba-container relative px-4">
            <div className="relative">
              <div
                className="grid overflow-hidden md:grid-cols-2"
                style={{ minHeight: 380 }}
              >
                {/* Texto — izquierda en desktop, abajo en mobile */}
                <div
                  className="order-2 flex flex-col justify-center px-7 py-9 md:order-1 md:px-12 md:py-10"
                  style={{ backgroundColor: slide.panelBg }}
                >
                  <span
                    className="mb-4 inline-flex w-fit items-center gap-2 px-3 py-1.5 text-[13px] font-bold"
                    style={{
                      backgroundColor: slide.badgeBg,
                      color: isLightBadge(slide.badgeBg) ? "#1a1b1a" : "#ffffff",
                    }}
                  >
                    {slide.badgeIcon ? (
                      <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white">
                        <Image
                          src={slide.badgeIcon}
                          alt=""
                          width={14}
                          height={14}
                          className="object-contain"
                        />
                      </span>
                    ) : null}
                    {slide.badge}
                  </span>
                  <h1 className="max-w-[420px] text-[28px] font-bold leading-[1.15] text-[#1a1b1a] md:text-[36px]">
                    {slide.title}
                  </h1>
                  <p className="mt-4 max-w-[420px] text-[15px] font-light leading-relaxed text-[#333] md:text-[16px]">
                    {slide.body}
                  </p>
                  <div className="mt-8">
                    <Link
                      href={slide.href}
                      className="inline-flex rounded-full bg-[#fdda24] px-8 py-2.5 text-[16px] font-bold uppercase tracking-wide text-[#1a1b1a]"
                    >
                      Ver más
                    </Link>
                  </div>
                </div>

                {/* Foto — derecha en desktop, arriba en mobile */}
                <div className="relative order-1 min-h-[240px] md:order-2 md:min-h-[380px]">
                  <Image
                    src={slide.image}
                    alt={slide.badge}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>

              <button
                type="button"
                aria-label="Anterior"
                onClick={() =>
                  setHeroIndex(
                    (i) => (i - 1 + PYME_HERO.length) % PYME_HERO.length,
                  )
                }
                className="absolute left-0 top-1/2 z-20 hidden h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fdda24] text-[#1a1b1a] shadow-sm md:grid"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                onClick={() =>
                  setHeroIndex((i) => (i + 1) % PYME_HERO.length)
                }
                className="absolute right-0 top-1/2 z-20 hidden h-[44px] w-[44px] translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fdda24] text-[#1a1b1a] shadow-sm md:grid"
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        </section>

        {/* Cliente PYME strip */}
        <section className="mt-0 bg-[#f0f0f0]">
          <div className="ba-container flex flex-wrap items-center justify-center gap-3 px-4 py-3.5">
            <p className="text-[15px] font-semibold text-[#1a1b1a] md:text-[16px]">
              ¿Deseas ser un cliente PYME? Te ayudamos a crecer
            </p>
            <Link
              href="/#contacto"
              className="inline-flex rounded-full border border-[#1a1b1a] bg-white px-5 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[#1a1b1a]"
            >
              Aquí
            </Link>
          </div>
        </section>

        {/* Soluciones con tabs */}
        <section id="soluciones" className="bg-white py-12">
          <div className="ba-container px-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/pyme/ico-financiacion.png"
                alt=""
                width={40}
                height={40}
                className="object-contain"
              />
              <h2 className="text-[28px] font-bold text-[#1a1b1a] md:text-[32px]">
                Acompañamos{" "}
                <span
                  className="inline-block rounded-[40px_17px_17px_40px] px-2"
                  style={{ backgroundColor: "#59cbe84f" }}
                >
                  tu crecimiento
                </span>
              </h2>
            </div>
            <p className="mt-2 text-[16px] text-[#555]">
              Explora las soluciones para tu Pyme
            </p>

            <div
              className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              role="tablist"
              aria-label="Categorías Pyme"
            >
              {PYME_CATEGORIES.map((cat) => {
                const active = cat.id === categoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-3 rounded-[14px] px-4 py-4 text-left transition ${
                      active
                        ? "bg-[#fdda24] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                        : "bg-[#f0f0f0] hover:bg-[#e8e8e8]"
                    }`}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white">
                      <Image
                        src={cat.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </span>
                    <span className="text-[15px] font-bold text-[#1a1b1a]">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              id="pagos"
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {category.products.map((product) => (
                <article
                  key={product.title}
                  className="rounded-[12px] border border-[#eee] bg-white p-5 shadow-[0_0_8px_rgba(0,0,0,0.04)]"
                >
                  <span
                    className="mb-4 grid h-12 w-12 place-items-center rounded-full"
                    style={{ backgroundColor: product.iconBg }}
                  >
                    <Image
                      src={product.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </span>
                  <h3 className="text-[18px] font-bold text-[#1a1b1a]">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#555]">
                    {product.description}
                  </p>
                  <Link
                    href={product.href}
                    className="mt-4 inline-block text-[14px] font-semibold text-[#1a1b1a] underline underline-offset-2"
                  >
                    Conoce más
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* e-banca Empresarial */}
        <section id="ebanca" className="bg-white py-4">
          <div className="ba-container overflow-hidden px-4">
            <div className="grid overflow-hidden rounded-sm md:grid-cols-2">
              <div className="flex flex-col justify-center bg-[#00c389] px-8 py-10 text-[#1a1b1a] md:px-12">
                <h2 className="text-[28px] font-bold leading-tight md:text-[34px]">
                  Bienvenido a la nueva e-banca Empresarial
                </h2>
                <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed">
                  Realiza consultas, transferencias y pagos, desde donde te
                  encuentres de una forma fácil, rápida y segura.
                </p>
                <div className="mt-7">
                  <Link
                    href="/login"
                    className="inline-flex rounded-full border-2 border-[#1a1b1a] bg-transparent px-7 py-2.5 text-[14px] font-bold uppercase tracking-wide text-[#1a1b1a] hover:bg-[#1a1b1a] hover:text-white"
                  >
                    Descubre más
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[260px] bg-[#e8f8f0]">
                <Image
                  src="/images/pyme/ebanca-empresas.png"
                  alt="e-banca Empresarial Bancoagrícola"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bienestar financiero */}
        <section className="bg-[#f4f4f4] py-12">
          <div className="ba-container px-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/pyme/ico-card.png"
                alt=""
                width={36}
                height={36}
                className="object-contain"
              />
              <h2 className="text-[28px] font-bold text-[#1a1b1a]">
                <span
                  className="inline-block rounded-[40px_17px_17px_40px] px-3 py-0.5"
                  style={{ backgroundColor: "#59cbe84f" }}
                >
                  Bienestar financiero
                </span>
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-[15px] text-[#555]">
              Con tu Tarjeta Débito Mastercard personal, explora cursos
              diseñados para fortalecer tus conocimientos en negocios
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-[280px_220px_1fr]">
              <div className="relative min-h-[280px] overflow-hidden rounded-[12px]">
                <Image
                  src="/images/pyme/bienestar.jpg"
                  alt="Bienestar financiero"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>

              <div className="flex flex-col gap-2" role="tablist">
                {PYME_COURSES.map((item) => {
                  const active = item.id === courseId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCourseId(item.id)}
                      className={`rounded-[10px] px-4 py-4 text-left text-[15px] font-bold transition ${
                        active
                          ? "bg-[#fadde8] text-[#1a1b1a]"
                          : "bg-white text-[#1a1b1a] hover:bg-[#f0f0f0]"
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[12px] bg-white p-6 shadow-[0_0_8px_rgba(0,0,0,0.04)]">
                <h3 className="text-[26px] font-bold text-[#1a1b1a]">
                  {course.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#555]">
                  {course.description}
                </p>
                <Link
                  href={course.href}
                  className="mt-6 inline-flex rounded-full bg-[#fdda24] px-6 py-2.5 text-[14px] font-bold uppercase tracking-wide text-[#1a1b1a]"
                >
                  Quiero aprender
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-[10px] bg-[#fff6c2] px-6 py-5 text-center">
              <span className="text-[18px] font-bold text-[#1a1b1a]">
                ¿Aún no la tienes?
              </span>
              <Link
                href="/tarjetas"
                className="text-[16px] font-semibold text-[#1a1b1a] underline underline-offset-2"
              >
                ¡Solicita tu Tarjeta Débito Mastercard!
              </Link>
            </div>
          </div>
        </section>

        {/* Atención Pyme */}
        <section id="contacto" className="bg-white py-12">
          <div className="ba-container px-4">
            <h2 className="text-[28px] font-bold text-[#1a1b1a]">Contáctanos</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <article className="rounded-[12px] border border-[#eee] bg-[#fafafa] p-6">
                <h3 className="text-[18px] font-bold text-[#1a1b1a]">
                  Atención especial
                </h3>
                <p className="mt-2 text-[14px] text-[#555]">
                  Escríbenos y te apoyaremos con tu consulta
                </p>
                <a
                  href="mailto:atencionpyme@bancoagricola.com.sv"
                  className="mt-4 inline-block text-[14px] font-semibold text-[#1a1b1a] underline"
                >
                  atencionpyme@bancoagricola.com.sv
                </a>
              </article>
              <article className="rounded-[12px] border border-[#eee] bg-[#fafafa] p-6">
                <h3 className="text-[18px] font-bold text-[#1a1b1a]">
                  Línea exclusiva WhatsApp
                </h3>
                <p className="mt-2 text-[14px] text-[#555]">Para clientes Pyme</p>
                <p className="mt-4 text-[22px] font-bold text-[#1a1b1a]">
                  7786-9494
                </p>
              </article>
              <article className="rounded-[12px] border border-[#eee] bg-[#fafafa] p-6">
                <h3 className="text-[18px] font-bold text-[#1a1b1a]">
                  Puntos de servicio
                </h3>
                <p className="mt-2 text-[14px] text-[#555]">
                  Encuentra la agencia más cercana
                </p>
                <Link
                  href="/#puntos"
                  className="mt-4 inline-block text-[14px] font-semibold text-[#1a1b1a] underline"
                >
                  Ver puntos de servicio
                </Link>
              </article>
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

function isLightBadge(bg: string) {
  return bg === "#f4b5cd" || bg === "#fadde8";
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
