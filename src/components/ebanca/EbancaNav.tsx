"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { clearSessionClient } from "@/lib/client-session";
import { useRouter } from "next/navigation";

const links = [
  { href: "/ebanca", label: "Resumen", exact: true },
  { href: "/ebanca/cuentas", label: "Cuentas" },
  { href: "/ebanca/movimientos", label: "Movimientos" },
  { href: "/ebanca/transferencias", label: "Transferencias" },
];

export function EbancaNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="border-b border-ba-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-ba-black text-white"
                      : "text-ba-muted hover:bg-ba-surface hover:text-ba-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ba-ink">{userName}</p>
            <p className="text-xs text-ba-muted">E-Banca Personas</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSessionClient();
              router.push("/login");
            }}
            className="rounded-full border border-ba-line px-3 py-1.5 text-sm font-medium text-ba-ink transition hover:border-ba-black"
          >
            Salir
          </button>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-ba-line px-4 py-2 md:hidden">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
                active ? "bg-ba-yellow text-ba-black" : "text-ba-muted"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
