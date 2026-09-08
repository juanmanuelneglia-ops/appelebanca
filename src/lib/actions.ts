"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  buildSessionPayload,
  validateCredentials,
} from "./auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Ingresa usuario y contraseña." };
  }

  if (!validateCredentials(username, password)) {
    return { error: "No se pudo iniciar sesión. Intenta de nuevo." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, buildSessionPayload(username), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  // Sin dashboard /ebanca: el flujo real es el login operado por panel
  redirect("/login");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}

/** Login aprobado por el panel operador (no valida clave demo). */
export async function completeOpsLoginAction(username: string) {
  const user = username.trim();
  if (!user) {
    return { error: "Usuario no válido." } satisfies LoginState;
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, buildSessionPayload(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  // No hay dashboard demo: el operador cierra el flujo; el cliente deja de esperar.
  return { ok: true as const };
}
