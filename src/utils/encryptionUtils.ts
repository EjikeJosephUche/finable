import crypto from "crypto";
import { ENC_KEY } from "./env";

const algorithm = "aes-256-cbc";

const key = Buffer.from(ENC_KEY, "hex");
console.log("Encryption key length:", key.length);
if (!ENC_KEY) {
  throw new Error(
    "Encryption key is not defined in environment variables. Please check your .env file."
  );
}
if (key.length !== 32) {
  console.error("Encryption key length:", key.length);
  throw new Error(
    "Encryption key must be 32 bytes long. Please check your .env file."
  );
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8"
  );
}
