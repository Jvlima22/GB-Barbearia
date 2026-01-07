"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface CreatePurchaseParams {
  productId: string
  quantity: number
}

export const createPurchase = async (params: CreatePurchaseParams) => {
  const session = await getServerSession(authOptions)

  if (!session?.user || !(session.user as any).id) {
    throw new Error("Usuário não autenticado!")
  }

  await db.purchase.create({
    data: {
      productId: params.productId,
      quantity: params.quantity,
      userId: (session.user as any).id,
    },
  })

  revalidatePath("/")
  revalidatePath("/admin")
}
