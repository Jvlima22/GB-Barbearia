"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

export const getAdminSummary = async () => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Acesso negado")
  }

  const [bookings, purchases, services, products] = await Promise.all([
    db.booking.findMany({
      include: {
        user: true,
        service: true,
      },
      orderBy: {
        date: "desc",
      },
    }),
    db.purchase.findMany({
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.service.findMany(),
    db.product.findMany(),
  ])

  return {
    bookings,
    purchases,
    services,
    products,
  }
}
