import crypto from "crypto"

// Use exactly 32 bytes for the key. Pad or slice as needed.
const ENCRYPTION_KEY = (
  process.env.ENCRYPTION_KEY || "GB_BARBEARIA_DEFAULT_KEY_32_CHARS"
)
  .padEnd(32, "0")
  .slice(0, 32)
const IV_LENGTH = 16
const ALGORITHM = "aes-256-cbc"

/**
 * Encrypts sensitive text using AES-256-CBC.
 */
export function encrypt(text: string): string {
  try {
    if (!text) return ""

    const key = Buffer.from(ENCRYPTION_KEY, "utf8")
    const iv = crypto.randomBytes(IV_LENGTH)

    // Using 'as any' on ALGORITHM and key/iv to bypass strict Node.js typing conflicts in Windows environment
    const cipher = crypto.createCipheriv(
      ALGORITHM as any,
      key as any,
      iv as any,
    )

    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    return iv.toString("hex") + ":" + encrypted
  } catch (error) {
    console.error("[Encryption Error]: Failed to encrypt data.", error)
    return text
  }
}

/**
 * Decrypts text encrypted by the encrypt function above.
 */
export function decrypt(text: string): string {
  try {
    if (!text || !text.includes(":")) {
      return text
    }

    const parts = text.split(":")
    const ivHex = parts.shift()
    const encryptedHex = parts.join(":")

    if (!ivHex || !encryptedHex) {
      return text
    }

    const key = Buffer.from(ENCRYPTION_KEY, "utf8")
    const iv = Buffer.from(ivHex, "hex")
    const encryptedBuffer = Buffer.from(encryptedHex, "hex")

    // Using 'as any' on ALGORITHM and key/iv to bypass strict Node.js typing conflicts in Windows environment
    const decipher = crypto.createDecipheriv(
      ALGORITHM as any,
      key as any,
      iv as any,
    )

    let decrypted = decipher.update(encryptedBuffer as any, undefined, "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.warn(
      "[Encryption Warning]: Decryption failed. Returning original text. Check if ENCRYPTION_KEY changed.",
    )
    return text
  }
}
