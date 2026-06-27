// Server-only admin helpers — NEVER import from client code.
import { pbkdf2Sync, randomBytes } from "crypto";

export const ADMIN_SESSION_CONFIG = {
  password:
    process.env.ADMIN_SESSION_SECRET ||
    "banglasathi-prototype-admin-session-secret-change-in-production-pls",
  name: "bs_admin",
  maxAge: 60 * 60 * 24 * 7,
};

export function verifyPassword(
  password: string,
  saltHex: string,
  expectedHashHex: string,
  iterations = 100000,
) {
  const salt = Buffer.from(saltHex, "hex");
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  // constant-time compare
  if (hash.length !== expectedHashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  return diff === 0;
}

export function hashPassword(password: string, iterations = 100000) {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return { salt: salt.toString("hex"), hash: hash.toString("hex"), iterations };
}
