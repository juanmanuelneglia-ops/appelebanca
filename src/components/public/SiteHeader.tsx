"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { EMPRESAS_NAV } from "@/lib/empresas";
import { PREFERENCIAL_NAV } from "@/lib/preferencial";
import { PYME_NAV } from "@/lib/pyme";

const segments = [
  { label: "Personas", href: "/" },
  { label: "Preferencial", href: "/preferencial" },
  { label: "Pyme", href: "/pyme" },
  { label: "Empresas y Gobierno", href: "/empresas" },
];

const personasNav = [
  { label: "Cuentas", href: "/cuentas" },
  { label: "Tarjetas", href: "/tarjetas" },
  { label: "Créditos", href: "/creditos" },
  { label: "Inversiones", href: "/inversiones" },
  { label: "Seguros", href: "/seguros" },
  { label: "Salvadoreños en el Exterior", href: "/promociones" },
  { label: "Promociones", href: "/promociones" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isPyme = pathname.startsWith("/pyme");
  const isEmpresas = pathname.startsWith("/empresas");
  const isPreferencial = pathname.startsWith("/preferencial");
  const nav = isPyme
    ? PYME_NAV
    : isEmpresas
      ? EMPRESAS_NAV
      : isPreferencial
        ? PREFERENCIAL_NAV
        : personasNav;
  const eBancaLabel =
    isPyme || isEmpresas ? "E-Banca Empresarial" : "E-Banca Personas";

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="hidden bg-[#2c2a29] lg:block">
        <div className="ba-container flex h-[40px] items-center justify-between">
          <ul className="m-0 flex h-full list-none items-stretch p-0">
            {segments.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.label} className="flex h-full">
                  <Link
                    href={item.href}
                    className="flex h-full items-center px-3.5 text-[13px]"
                    style={
                      active
                        ? {
                            backgroundColor: "#ffffff",
                            color: "#1a1b1a",
                            fontWeight: 600,
                          }
                        : {
                            backgroundColor: "transparent",
                            color: "#ffffff",
                            fontWeight: 400,
                          }
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/#contacto"
              className="inline-flex h-[26px] items-center rounded-full border border-white px-3 text-[10px] font-normal uppercase tracking-wide hover:bg-white hover:text-[#2c2a29]"
              style={{ color: "#ffffff" }}
            >
              Atención al cliente
            </Link>
            <Link
              href="/#puntos"
              className="inline-flex h-[26px] items-center rounded-full border border-white px-3 text-[10px] font-normal uppercase tracking-wide hover:bg-white hover:text-[#2c2a29]"
              style={{ color: "#ffffff" }}
            >
              Puntos de servicio
            </Link>
            <Link
              href="/#contacto"
              aria-label="Buscar"
              className="ml-1 grid place-items-center"
            >
              <Image
                src="/images/buscador.png"
                alt="buscador"
                width={16}
                height={16}
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-[#eeeeee] bg-white">
        <div className="ba-container flex min-h-[70px] items-center gap-3 py-2">
          <div className="w-[160px] shrink-0">
            <Logo />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-x-5 xl:flex">
            {nav.map((item) => {
              const active =
                !item.href.includes("#") && pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative whitespace-nowrap pb-0.5 text-[14px] text-[#1a1b1a] transition-colors hover:opacity-80 ${
                    active
                      ? "font-semibold after:absolute after:inset-x-0 after:-bottom-1 after:h-[3px] after:bg-[#fdda24]"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto shrink-0">
            <Link
              href="/login"
              className="inline-flex h-[42px] items-center gap-2 rounded-full bg-[#fdda24] px-5 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a] hover:shadow-[0_1px_8px_rgb(0_0_0_/_8%)]"
            >
              {eBancaLabel}
              <Image
                src="/images/padlock.png"
                alt=""
                width={14}
                height={16}
                className="object-contain"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
