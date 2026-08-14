import crypto from "crypto";

const COOKIE_NAME = "event_admin_session";
const DEFAULT_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET not set in environment");
  return s;
}

function base64(input: string) {
  return Buffer.from(input).toString("base64");
}

function unbase64(input: string) {
  return Buffer.from(input, "base64").toString("utf8");
}

export function createSessionValue(opts?: { username?: string; maxAge?: number }) {
  const username = opts?.username ?? "admin";
  const maxAge = opts?.maxAge ?? DEFAULT_MAX_AGE;
  const exp = Math.floor(Date.now() / 1000) + maxAge;
  const payload = { u: username, exp };
  const payloadB64 = base64(JSON.stringify(payload));
  const h = crypto.createHmac("sha256", getSecret()).update(payloadB64).digest("hex");
  return { value: `${payloadB64}.${h}`, maxAge };
}

export function buildSetCookieHeader(sessionValue: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${sessionValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function buildClearCookieHeader() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function parseCookieHeader(header: string | null) {
  if (!header) return {} as Record<string,string>;
  return header.split(";").map(p => p.trim()).reduce((acc, part) => {
    const [k, ...v] = part.split("=");
    if (!k) return acc;
    acc[k] = v.join("=");
    return acc;
  }, {} as Record<string,string>);
}

export function verifySessionValue(sessionValue?: string) {
  if (!sessionValue) return false;
  const [payloadB64, sig] = sessionValue.split('.');
  if (!payloadB64 || !sig) return false;
  const expected = crypto.createHmac("sha256", getSecret()).update(payloadB64).digest("hex");
  // constant-time compare
  const validSig = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  if (!validSig) return false;
  try {
    const payload = JSON.parse(unbase64(payloadB64));
    if (!payload?.exp) return false;
    return Math.floor(Date.now() / 1000) < payload.exp;
  } catch (err) {
    return false;
  }
}

export function getCookieName() { return COOKIE_NAME; }

export default {
  createSessionValue,
  buildSetCookieHeader,
  buildClearCookieHeader,
  parseCookieHeader,
  verifySessionValue,
  getCookieName,
};
