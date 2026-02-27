"use server";

import { db } from "@/app/_lib/prisma";

export const getBanks = async () => {
  return await db.bank.findMany({
    include: {
      credentials: {
        select: {
          id: true,
          // Em um mundo real, JAMAIS retornar credenciais abertas,
          // Apenas informar se existem:
          environment: true,
          isDefault: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};
