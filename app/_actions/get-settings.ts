"use server"

import { db } from "../_lib/prisma"

export const getSettings = async () => {
    const settings = await db.settings.findFirst()
    return settings
}
