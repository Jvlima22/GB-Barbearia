"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/app/_lib/prisma"

export const deleteBankCredential = async (bankId: string) => {
  try {
    const existing = await db.bankCredential.findUnique({
      where: { bankId },
    })

    if (existing) {
      await db.bankCredential.delete({
        where: { id: existing.id },
      })
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error(error)
    throw new Error("Erro ao desconectar banco")
  }
}
