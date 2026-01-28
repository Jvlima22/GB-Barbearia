"use strict"

"use server"

import { db } from "@/app/_lib/prisma"
import { serviceSchema } from "../admin/_schemas"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

export const upsertService = async (params: {
    id?: string
    name: string
    description: string
    imageUrl: string
    price: number
}) => {
    const session = await getServerSession(authOptions)

    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("Não autorizado")
    }

    const { id, name, description, imageUrl, price } = serviceSchema.parse(params)

    if (id) {
        await db.service.update({
            where: { id },
            data: { name, description, imageUrl, price },
        })
    } else {
        await db.service.create({
            data: { name, description, imageUrl, price },
        })
    }

    revalidatePath("/admin")
    revalidatePath("/")
}
