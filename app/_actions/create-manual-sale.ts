"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface CreateManualSaleParams {
  userId: string
  productId: string
  quantity: number
}

export const createManualSale = async (params: CreateManualSaleParams) => {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Somente administradores podem realizar vendas manuais.")
  }

  await db.purchase.create({
    data: {
      userId: params.userId,
      productId: params.productId,
      quantity: params.quantity,
      paymentStatus: "SUCCEEDED", // Manual sales are usually paid on the spot
    },
  })

  revalidatePath("/")
  revalidatePath("/admin")
}
