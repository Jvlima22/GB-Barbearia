"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/_lib/prisma";
import { encrypt } from "@/app/_lib/encryption";

export const upsertBankCredential = async (params: {
  bankId: string;
  clientId: string;
  clientSecret: string;
  publicKey?: string;
  customWebhook?: string;
  environment: "SANDBOX" | "PRODUCTION";
}) => {
  // Encrypt the sensitive data
  const encryptedClientId = encrypt(params.clientId);
  const encryptedClientSecret = encrypt(params.clientSecret);

  // Check if bank credential already exists for this bank
  const existing = await db.bankCredential.findUnique({
    where: { bankId: params.bankId },
  });

  if (existing) {
    await db.bankCredential.update({
      where: { id: existing.id },
      data: {
        clientId: encryptedClientId,
        clientSecret: encryptedClientSecret,
        publicKey: params.publicKey,
        customWebhook: params.customWebhook,
        environment: params.environment,
      },
    });
  } else {
    // If we only have one bank credential, make it default
    const count = await db.bankCredential.count();
    
    await db.bankCredential.create({
      data: {
        bankId: params.bankId,
        clientId: encryptedClientId,
        clientSecret: encryptedClientSecret,
        publicKey: params.publicKey,
        customWebhook: params.customWebhook,
        environment: params.environment,
        isDefault: count === 0,
      },
    });
  }

  revalidatePath("/admin/bancos");
};
