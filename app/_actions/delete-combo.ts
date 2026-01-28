"use strict"

"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

export const deleteCombo = async (id: string) => {
    const session = await getServerSession(authOptions)

    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("Não autorizado")
    }

    await (db as any).combo.delete({
        where: { id },
    })

    revalidatePath("/admin")
    revalidatePath("/")
}
