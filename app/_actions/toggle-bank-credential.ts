"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/app/_lib/prisma"

export const toggleBankCredentialStatus = async (
  bankId: string,
  isEnabled: boolean,
) => {
  try {
    const existing = await db.bankCredential.findUnique({
      where: { bankId },
    })

    if (!existing) {
      throw new Error("Configuração bancária não encontrada")
    }

    await db.bankCredential.update({
      where: { id: existing.id },
      data: { isEnabled },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error(error)
    throw new Error("Erro ao alterar status do banco")
  }
}
