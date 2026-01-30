"use server"

import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface UpsertOperatingDayProps {
  dayOfWeek: number
  startTime: string
  endTime: string
  isOpen: boolean
}

export const upsertOperatingDay = async (props: UpsertOperatingDayProps) => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Acesso negado")
  }

  await (db as any).operatingDay.upsert({
    where: { dayOfWeek: props.dayOfWeek },
    update: props,
    create: props,
  })

  revalidatePath("/admin")
  revalidatePath("/")
}
