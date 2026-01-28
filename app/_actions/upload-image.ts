"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

export const uploadImage = async (formData: FormData) => {
    const session = await getServerSession(authOptions)

    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("Não autorizado")
    }

    const file = formData.get("file") as File
    if (!file) {
        throw new Error("Nenhum arquivo enviado")
    }

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    const uploadDir = join(process.cwd(), "public", "uploads")

    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (err) {
        // Ignore if directory already exists
    }

    // Create a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    const filepath = join(uploadDir, filename)

    await writeFile(filepath, buffer)

    return `/uploads/${filename}`
}
