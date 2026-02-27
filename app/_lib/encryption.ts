import crypto from "crypto"

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex") // 256 bits
const IV_LENGTH = 16 // AES requires 16 bytes

export function encrypt(text: string) {
  const keyBuffer = Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32))
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv)

  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString("hex") + ":" + encrypted.toString("hex")
}

export function decrypt(text: string) {
  const parts = text.split(":")
  const ivStr = parts.shift()
  if (!ivStr) throw new Error("Invalid encrypted text format")

  const iv = Buffer.from(ivStr, "hex")
  const encryptedText = Buffer.from(parts.join(":"), "hex")
  const keyBuffer = Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32))

  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv)

  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}
