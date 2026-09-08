"use client";

import Link from "next/link";
import { useState } from "react";

export function SavingsPromo() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:px-6">
      <div className="pointer-events-auto relative flex w-full max-w-[920px] items-center gap-4 overflow-hidden rounded-md bg-black py-3 pl-3 pr-10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:gap-5 sm:py-4 sm:pl-4 sm:pr-12">
        <span className="absolute inset-y-0 left-0 w-[5px] bg-[#ffd200]" />
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-[#ffd200] text-black">
          <PiggyIcon />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold sm:text-[15px]">
            Cuando surge un gasto inesperado, tu ahorro responde
          </p>
          <p className="mt-0.5 hidden text-[12px] text-white/70 sm:block">
            Abre tu Cuenta de Ahorro Digital y empieza a construir tu colchón
            financiero hoy.
          </p>
        </div>
        <Link
          href="/cuentas"
          className="hidden shrink-0 rounded-full border border-white px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-white hover:text-black sm:inline-flex"
        >
          Comenzar a ahorrar
        </Link>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function PiggyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M12.5 4.2c.4 0 .8.05 1.1.14l.5-1.34h1.5l-.7 1.85A5.6 5.6 0 0118 9.2v.8h1.2a1.3 1.3 0 011.3 1.3v2.1a1.3 1.3 0 01-.9 1.24V17a1 1 0 01-1 1h-1.2a1 1 0 01-1-1v-.5H8.8V17a1 1 0 01-1 1H6.6a1 1 0 01-1-1v-2.16A2.9 2.9 0 014 12.2V10a1.8 1.8 0 011.2-1.7l.8-2.3A5.5 5.5 0 0112.5 4.2zm2.2 5.3a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  );
}
