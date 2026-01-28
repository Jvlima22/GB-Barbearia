"use strict"

"use server"

import { db } from "@/app/_lib/prisma"
import { productSchema } from "../admin/_schemas"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

export const upsertProduct = async (params: {
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

    const { id, name, description, imageUrl, price } = productSchema.parse(params)

    if (id) {
        await db.product.update({
            where: { id },
            data: { name, description, imageUrl, price },
        })
    } else {
        await db.product.create({
            data: { name, description, imageUrl, price },
        })
    }

    revalidatePath("/admin")
    revalidatePath("/products")
    revalidatePath("/")
}
