import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./constants";
import { DEMO_USER } from "./data";

export { SESSION_COOKIE };

export type Session = {
  username: string;
  name: string;
};

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Session;
    if (!parsed.username || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function validateCredentials(username: string, password: string) {
  // Demo: cualquier usuario + clave demo (la pantalla de clave se omite en el flujo)
  return username.trim().length > 0 && password === DEMO_USER.password;
}

export function buildSessionPayload(username = DEMO_USER.username) {
  return encodeURIComponent(
    JSON.stringify({
      username: username.trim() || DEMO_USER.username,
      name: DEMO_USER.name,
    } satisfies Session),
  );
}
