"use server"

import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { startOfDay } from "date-fns"

interface UpsertOperatingExceptionProps {
  id?: string
  date: Date
  startTime?: string
  endTime?: string
  isOpen: boolean
  description?: string
}

export const upsertOperatingException = async (
  props: UpsertOperatingExceptionProps,
) => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Acesso negado")
  }

  const normalizedDate = startOfDay(props.date)

  if (props.id) {
    await (db as any).operatingException.update({
      where: { id: props.id },
      data: {
        date: normalizedDate,
        startTime: props.startTime,
        endTime: props.endTime,
        isOpen: props.isOpen,
        description: props.description,
      },
    })
  } else {
    await (db as any).operatingException.create({
      data: {
        date: normalizedDate,
        startTime: props.startTime,
        endTime: props.endTime,
        isOpen: props.isOpen,
        description: props.description,
      },
    })
  }

  revalidatePath("/admin")
  revalidatePath("/")
}

export const deleteOperatingException = async (id: string) => {
  const session = await getServerSession(authOptions)

  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Acesso negado")
  }

  await (db as any).operatingException.delete({
    where: { id },
  })

  revalidatePath("/admin")
  revalidatePath("/")
}
