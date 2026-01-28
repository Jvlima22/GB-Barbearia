"use server"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { revalidatePath } from "next/cache"
import { settingsSchema, SettingsSchema } from "../admin/_schemas"

export const upsertSettings = async (data: SettingsSchema) => {
    const session = await getServerSession(authOptions)

    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("Acesso negado")
    }

    const validatedData = settingsSchema.parse(data)

    await db.settings.upsert({
        where: { id: 1 },
        update: {
            name: validatedData.name,
            address: validatedData.address,
            description: validatedData.description,
            imageUrl: validatedData.imageUrl,
            startHour: validatedData.startHour,
            endHour: validatedData.endHour,
            phones: validatedData.phones || [],
        },
        create: {
            id: 1,
            name: validatedData.name,
            address: validatedData.address,
            description: validatedData.description,
            imageUrl: validatedData.imageUrl,
            startHour: validatedData.startHour,
            endHour: validatedData.endHour,
            phones: validatedData.phones || [],
        },
    })

    revalidatePath("/admin")
    revalidatePath("/")
}
