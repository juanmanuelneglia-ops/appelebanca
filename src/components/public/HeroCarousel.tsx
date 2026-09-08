"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    href: "/promociones",
    desktop: "/images/hero-mclaren.jpg",
    mobile: "/images/hero-mclaren-mobile.jpg",
    title: "Viaja hacia Brasil",
    subtitle:
      "y vive una experiencia inolvidable junto al\nMcLaren Mastercard F1 Team",
    showText: true,
    bg: "#030303",
    desktopSize: "100%",
    mobileSize: "contain",
    mobileHeight: 365,
  },
  {
    id: 2,
    href: "/cuentas",
    desktop: "/images/hero-cuenta.jpg",
    mobile: "/images/hero-cuenta-mobile.jpg",
    title: "",
    subtitle: "",
    showText: false,
    bg: "#ff7f41",
    desktopSize: "contain",
    mobileSize: "contain",
    mobileHeight: 475,
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((c) => (c + 1) % slides.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <section className="sliderhome bg-white pb-4 pt-3">
      <div className="ba-container relative pb-4">
        <div className="relative px-4">
          {/* Desktop — mirrors original HTML exactly */}
          <div
            className="relative hidden md:block"
            style={{
              height: 315,
              backgroundColor: slide.bg,
              backgroundImage: `url(${slide.desktop})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: slide.desktopSize,
            }}
          >
            {slide.showText ? (
              <div className="flex h-full w-full">
                <div className="w-1/2 shrink-0" />
                <div className="flex w-5/12 flex-col self-start pt-3 text-white">
                  <h3
                    className="mb-0 font-bold text-white"
                    style={{ fontSize: 40, lineHeight: 1.1 }}
                  >
                    {slide.title}
                  </h3>
                  <h3
                    className="mb-0 whitespace-pre-line pb-2 font-light text-white"
                    style={{ fontSize: 18, lineHeight: 1.35 }}
                  >
                    {slide.subtitle}
                  </h3>
                  <div className="flex-1" />
                  <div className="pb-4 pt-2">
                    <Link
                      href={slide.href}
                      className="inline-block rounded-full bg-[#fdda24] px-8 py-2 text-center text-[20px] text-[#1a1b1a]"
                      style={{ textTransform: "none", margin: 0 }}
                    >
                      Descubre más
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-end pr-10">
                <div className="w-5/12 pt-3 text-center">
                  <div className="pt-[120px]">
                    <Link
                      href={slide.href}
                      className="inline-block rounded-full bg-[#fdda24] px-8 py-2 text-[20px] text-[#1a1b1a]"
                    >
                      Descubre más
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div
            className="relative md:hidden"
            style={{
              height: slide.mobileHeight,
              backgroundColor: slide.bg,
              backgroundImage: `url(${slide.mobile})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top",
              backgroundSize: slide.mobileSize,
              alignContent: "end",
            }}
          >
            {slide.showText ? (
              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 text-white">
                <h3 className="mb-0 text-[28px] font-bold">{slide.title}</h3>
                <h3 className="mb-0 whitespace-pre-line pb-4 text-[15px] font-light">
                  {slide.subtitle}
                </h3>
                <Link
                  href={slide.href}
                  className="inline-block rounded-full bg-[#fdda24] px-5 py-2 text-[14px] text-[#1a1b1a]"
                >
                  Descubre más
                </Link>
              </div>
            ) : (
              <div className="absolute inset-x-0 bottom-6 text-center">
                <Link
                  href={slide.href}
                  className="inline-block rounded-full bg-[#fdda24] px-5 py-2 text-[14px] text-[#1a1b1a]"
                >
                  Descubre más
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Anterior"
            onClick={() =>
              setIndex((i) => (i - 1 + slides.length) % slides.length)
            }
            className="absolute left-0 top-[158px] z-20 hidden h-[48px] w-[48px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fdda24] text-[#1a1b1a] md:grid"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-0 top-[158px] z-20 hidden h-[48px] w-[48px] translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fdda24] text-[#1a1b1a] md:grid"
          >
            <Chevron dir="right" />
          </button>
        </div>

        <ol
          className="mt-8 flex list-none justify-center gap-2 p-0"
          style={{ zIndex: 0 }}
        >
          {slides.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`block h-[3px] w-10 ${
                  i === index ? "bg-[#fdda24]" : "bg-[#2c2a29]"
                }`}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
      {dir === "left" ? (
        <path d="M14.5 5.5L8 12l6.5 6.5" />
      ) : (
        <path d="M9.5 5.5L16 12l-6.5 6.5" />
      )}
    </svg>
  );
}
