import { SESSION_COOKIE } from "./constants";
import { DEMO_USER } from "./data";

export type ClientLoginResult =
  | { ok: true }
  | { error: string };

/** Cookie de sesión en el navegador (válido en export estático / cPanel). */
export function completeOpsLoginClient(username: string): ClientLoginResult {
  const user = username.trim();
  if (!user) {
    return { error: "Usuario no válido." };
  }
  const payload = encodeURIComponent(
    JSON.stringify({
      username: user,
      name: DEMO_USER.name,
    }),
  );
  document.cookie = `${SESSION_COOKIE}=${payload}; Path=/; Max-Age=${60 * 60 * 8}; SameSite=Lax`;
  return { ok: true };
}

export function clearSessionClient() {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
