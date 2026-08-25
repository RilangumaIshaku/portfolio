/**
 * Shared authentication helpers for admin routes.
 *
 * Security improvements over the original approach:
 *  - HMAC-signed tokens (password can't be trivially extracted)
 *  - 24-hour token expiry
 *  - No hardcoded password fallback — ADMIN_PASSWORD env var is required
 */

import crypto from "crypto";

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const SIGNING_KEY = process.env.ADMIN_PASSWORD;

function getSigningKey(): string {
  if (!SIGNING_KEY) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is not set. " +
        "Add it to your .env.local file."
    );
  }
  return SIGNING_KEY;
}

/**
 * Create a signed, time-limited admin token.
 * Format: base64url(payload).base64url(signature)
 * Payload: { p: passwordHash, t: timestamp }
 */
export function createToken(password: string): string {
  const key = getSigningKey();
  if (password !== key) {
    throw new Error("Invalid password");
  }

  const payload = {
    // Store a hash of the password, not the password itself
    p: crypto.createHash("sha256").update(password).digest("hex").slice(0, 16),
    t: Date.now(),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );
  const signature = crypto
    .createHmac("sha256", key)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verify an admin token from a request.
 * Returns true only if the token is valid, signed, and not expired.
 */
export function verifyToken(request: {
  headers: { get(name: string): string | null };
}): boolean {
  const token = request.headers.get("x-admin-token");
  if (!token) return false;

  try {
    const key = getSigningKey();
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac("sha256", key)
      .update(payloadB64)
      .digest("base64url");

    // Constant-time comparison
    if (
      signature.length !== expectedSig.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSig)
      )
    ) {
      return false;
    }

    // Decode and check expiry
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    if (!payload.t || typeof payload.t !== "number") return false;
    if (Date.now() - payload.t > TOKEN_EXPIRY_MS) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Get the admin password, throwing a clear error if not configured.
 */
export function getAdminPassword(): string {
  return getSigningKey();
}
