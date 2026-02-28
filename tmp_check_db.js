const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const b = await prisma.bank.findFirst({
    where: { provider: "MERCADO_PAGO" },
    include: { credentials: true },
  })
  console.log("MERCADO_PAGO:", JSON.stringify(b, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
