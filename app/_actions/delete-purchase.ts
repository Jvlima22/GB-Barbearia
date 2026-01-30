"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

export const deletePurchase = async (purchaseId: string) => {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Somente administradores podem excluir vendas.")
  }

  await db.purchase.delete({
    where: {
      id: purchaseId,
    },
  })

  revalidatePath("/")
  revalidatePath("/admin")
}
