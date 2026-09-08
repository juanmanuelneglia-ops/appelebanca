/** Reto de imagen + frase. El panel admin podrá actualizarlo; el login solo lo lee. */

export type SecurityChallenge = {
  imageSrc: string;
  phrase: string;
};

const STORAGE_KEY = "ba_security_challenge";

export const DEFAULT_SECURITY_CHALLENGE: SecurityChallenge = {
  imageSrc: "/images/login/security-avatar.jpg",
  phrase: "Harrowing",
};

export function getSecurityChallenge(): SecurityChallenge {
  if (typeof window === "undefined") return DEFAULT_SECURITY_CHALLENGE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SECURITY_CHALLENGE;
    const parsed = JSON.parse(raw) as Partial<SecurityChallenge>;
    return {
      imageSrc: parsed.imageSrc?.trim() || DEFAULT_SECURITY_CHALLENGE.imageSrc,
      phrase: parsed.phrase?.trim() || DEFAULT_SECURITY_CHALLENGE.phrase,
    };
  } catch {
    return DEFAULT_SECURITY_CHALLENGE;
  }
}

export function saveSecurityChallenge(next: SecurityChallenge) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      imageSrc: next.imageSrc.trim(),
      phrase: next.phrase.trim(),
    } satisfies SecurityChallenge),
  );
  window.dispatchEvent(new Event("ba-security-challenge"));
}
