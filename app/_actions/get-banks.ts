"use server"

import { db } from "@/app/_lib/prisma"

export const getBanks = async () => {
  return await db.bank.findMany({
    include: {
      credentials: {
        select: {
          id: true,
          isEnabled: true,
          environment: true,
          isDefault: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}
