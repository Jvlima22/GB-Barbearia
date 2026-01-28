"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { setHours, setMinutes } from "date-fns"

interface CreateManualBookingParams {
    userId: string
    serviceId: string
    date: Date
    hour: string
}

export const createManualBooking = async (params: CreateManualBookingParams) => {
    const session = await getServerSession(authOptions)

    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("Acesso negado. Apenas administradores podem criar agendamentos manuais.")
    }

    const [hours, minutes] = params.hour.split(":").map(Number)
    const bookingDate = setHours(setMinutes(params.date, minutes), hours)

    await db.booking.create({
        data: {
            serviceId: params.serviceId,
            userId: params.userId,
            date: bookingDate,
            paymentStatus: "SUCCEEDED", // Marcado como pago manualmente
        },
    })

    revalidatePath("/admin")
}
