"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/app/_lib/prisma"
import { encrypt } from "@/app/_lib/encryption"

export const upsertBankCredential = async (params: {
  bankId: string
  clientId: string
  clientSecret: string
  publicKey?: string
  customWebhook?: string
  environment: "SANDBOX" | "PRODUCTION"
}) => {
  const bank = await db.bank.findUnique({
    where: { id: params.bankId },
  })

  if (!bank) throw new Error("Banco não encontrado")

  // Limpeza de caracteres não-ASCII (que causam o erro de ByteString no Next.js)
  const cleanString = (s: string) => s.replace(/[^\x00-\x7F]/g, "").trim()

  let finalClientId = cleanString(params.clientId)
  const accessToken = cleanString(params.clientSecret)

  // Validação Simplificada Mercado Pago (Apenas Access Token)
  if (bank.provider === "MERCADO_PAGO") {
    try {
      // 1. Validação do Token (Obrigatório)
      const resMe = await fetch("https://api.mercadopago.com/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })

      if (!resMe.ok) {
        throw new Error(
          "Access Token inválido ou expirado. Verifique no painel do Mercado Pago.",
        )
      }

      const userData = await resMe.json()

      // Se o usuário não enviou Client ID, usamos o ID da conta do Mercado Pago como ID de referência
      if (!finalClientId) {
        finalClientId = String(userData.id)
      }

      console.log(
        `[MP Connect] Conta conectada: ${userData.nickname || userData.email}`,
      )
    } catch (error: any) {
      console.error("[MP Validation Error]:", error.message)
      throw new Error(
        error.message || "Erro ao validar Access Token do Mercado Pago.",
      )
    }
  } else {
    // Para outros bancos, o Client ID continua obrigatório
    if (!finalClientId || !accessToken) {
      throw new Error(
        "Client ID e Client Secret são obrigatórios para este banco.",
      )
    }
  }

  // Criptografia e Salvamento
  const encryptedClientId = encrypt(finalClientId)
  const encryptedClientSecret = encrypt(accessToken)

  const existing = await db.bankCredential.findUnique({
    where: { bankId: params.bankId },
  })

  if (existing) {
    await db.bankCredential.update({
      where: { id: existing.id },
      data: {
        clientId: encryptedClientId,
        clientSecret: encryptedClientSecret,
        publicKey: params.publicKey?.trim(),
        customWebhook: params.customWebhook?.trim(),
        environment: params.environment,
      },
    })
  } else {
    const count = await db.bankCredential.count()
    await db.bankCredential.create({
      data: {
        bankId: params.bankId,
        clientId: encryptedClientId,
        clientSecret: encryptedClientSecret,
        publicKey: params.publicKey?.trim(),
        customWebhook: params.customWebhook?.trim(),
        environment: params.environment,
        isDefault: count === 0,
      },
    })
  }

  revalidatePath("/admin")
  revalidatePath("/")
}
