"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { setHours, setMinutes } from "date-fns"

interface CreateManualBookingParams {
  userId: string
  serviceId?: string
  comboId?: string
  date: Date
  hour: string
}

export const createManualBooking = async (
  params: CreateManualBookingParams,
) => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error(
      "Acesso negado. Apenas administradores podem criar agendamentos manuais.",
    )
  }

  const [hours, minutes] = params.hour.split(":").map(Number)
  const bookingDate = setHours(setMinutes(params.date, minutes), hours)

  const existingBooking = await db.booking.findFirst({
    where: {
      date: bookingDate,
    },
  })

  if (existingBooking) {
    throw new Error("Já existe um agendamento para este horário.")
  }

  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      comboId: params.comboId,
      userId: params.userId,
      date: bookingDate,
      paymentStatus: "SUCCEEDED", // Marcado como pago manualmente
    } as any,
  })

  revalidatePath("/admin")
}
