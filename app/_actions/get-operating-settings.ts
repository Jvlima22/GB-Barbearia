"use server"

import { db } from "../_lib/prisma"

export const getOperatingDays = async () => {
  return await (db as any).operatingDay.findMany({
    orderBy: {
      dayOfWeek: "asc",
    },
  })
}

export const getOperatingExceptions = async () => {
  return await (db as any).operatingException.findMany({
    orderBy: {
      date: "asc",
    },
  })
}
