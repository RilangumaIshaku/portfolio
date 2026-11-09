import crypto from "crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 60 * 1000;

/**
 * Admin authentication.
 *
 * The previous version used the admin password itself as the HMAC signing key
 * and embedded `sha256(password)[:16]` in the token payload. Anyone holding a
 * token could therefore crack the password offline (no rate limit, no lockout)
 * and, with the same secret, forge tokens. Sessions are now signed with a
 * separate ADMIN_SESSION_SECRET; ADMIN_PASSWORD is only a fallback so existing
 * deployments keep working after this change.
 *
 * Revocation: a stateless token cannot be invalidated individually without
 * storage, so the payload carries a generation number. Bumping
 * ADMIN_SESSION_EPOCH invalidates every live token at once.
 */
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) is not set. Add it to .env.local."
    );
  }
  return secret;
}

function getSessionEpoch(): string {
  return (process.env.ADMIN_SESSION_EPOCH || "1").trim() || "1";
}

function digest(value: string): Buffer {
  return crypto.createHash("sha256").update(value, "utf8").digest();
}

/**
 * Constant-time password check. The old `password !== key` comparison leaked
 * the length of the matching prefix through timing.
 */
export function passwordMatches(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is not set. " +
        "Add it to your .env.local file."
    );
  }
  return crypto.timingSafeEqual(digest(password ?? ""), digest(expected));
}

/**
 * Create a signed, time-limited admin token.
 * Format: base64url(payload).base64url(signature)
 * Payload: { sid, iat, exp, v } — nothing derived from the password.
 */
export function createToken(password: string): string {
  if (!passwordMatches(password)) {
    throw new Error("Invalid password");
  }

  const issuedAt = Date.now();
  const payload = {
    sid: crypto.randomBytes(12).toString("base64url"),
    iat: issuedAt,
    exp: issuedAt + TOKEN_TTL_MS,
    v: getSessionEpoch(),
  };

  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(body)
    .digest("base64url");

  return `${body}.${signature}`;
}

interface SessionPayload {
  sid?: unknown;
  iat?: unknown;
  exp?: unknown;
  v?: unknown;
}

/**
 * Verify an admin token: signature first, then shape, generation and time.
 * Tokens issued before this change (payload `p`/`t`) fail shape validation, so
 * they force a fresh login rather than being silently accepted.
 */
export function verifyToken(request: {
  headers: { get(name: string): string | null };
}): boolean {
  const token = request.headers.get("x-admin-token");
  if (!token) return false;

  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  try {
    const key = getSessionSecret();
    const expected = crypto
      .createHmac("sha256", key)
      .update(body)
      .digest("base64url");

    // Constant-time comparison of the signature.
    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      )
    ) {
      return false;
    }

    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf-8")
    ) as SessionPayload;

    if (typeof payload.sid !== "string" || payload.sid.length < 8) return false;
    if (typeof payload.iat !== "number" || typeof payload.exp !== "number") {
      return false;
    }
    if (payload.v !== getSessionEpoch()) return false;

    const now = Date.now();
    if (now > payload.exp) return false;
    // A token dated in the future is not a token we issued.
    if (payload.iat > now + CLOCK_SKEW_MS) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Kept for callers that only need to know whether a password is configured.
 */
export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable is not set.");
  }
  return password;
}
