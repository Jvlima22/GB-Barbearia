"use strict"

"use server"

import { db } from "@/app/_lib/prisma"
import { comboSchema } from "../admin/_schemas"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

export const upsertCombo = async (params: {
    id?: string
    name: string
    description: string
    imageUrl: string
    price?: number
    service1Id: string
    service2Id: string
}) => {
    const session = await getServerSession(authOptions)

    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("Não autorizado")
    }

    const { id, name, description, imageUrl, price, service1Id, service2Id } =
        comboSchema.parse(params)

    let finalPrice = price

    if (!finalPrice || finalPrice <= 0) {
        // Fetch services to calculate total price
        const [service1, service2] = await Promise.all([
            db.service.findUnique({ where: { id: service1Id } }),
            db.service.findUnique({ where: { id: service2Id } }),
        ])

        if (!service1 || !service2) {
            throw new Error("Serviços não encontrados")
        }

        finalPrice = Number(service1.price) + Number(service2.price)
    }

    if (id) {
        await (db as any).combo.update({
            where: { id },
            data: {
                name,
                description,
                imageUrl,
                price: finalPrice,
                service1Id,
                service2Id
            },
        })
    } else {
        await (db as any).combo.create({
            data: {
                name,
                description,
                imageUrl,
                price: finalPrice,
                service1Id,
                service2Id
            },
        })
    }

    revalidatePath("/admin")
    revalidatePath("/")
}
