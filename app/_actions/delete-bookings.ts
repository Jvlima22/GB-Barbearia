"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

export const deleteBooking = async (bookingId: string) => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Apenas administradores podem excluir agendamentos.")
  }

  await db.booking.delete({
    where: {
      id: bookingId,
    },
  })

  revalidatePath("/bookings")
  revalidatePath("/admin")
}
