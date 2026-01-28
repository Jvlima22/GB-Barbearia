-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "endHour" TEXT NOT NULL DEFAULT '19:00',
ADD COLUMN     "startHour" TEXT NOT NULL DEFAULT '09:00';

-- CreateTable
CREATE TABLE "Combo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "service1Id" TEXT NOT NULL,
    "service2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Combo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Combo" ADD CONSTRAINT "Combo_service1Id_fkey" FOREIGN KEY ("service1Id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combo" ADD CONSTRAINT "Combo_service2Id_fkey" FOREIGN KEY ("service2Id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
