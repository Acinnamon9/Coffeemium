/*
  Warnings:

  - You are about to drop the column `productId` on the `Roast` table. All the data in the column will be lost.
  - You are about to drop the column `roastMultiplier` on the `Roast` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Roast" DROP CONSTRAINT "Roast_productId_fkey";

-- AlterTable
ALTER TABLE "Roast" DROP COLUMN "productId",
DROP COLUMN "roastMultiplier",
ADD COLUMN     "defaultMultiplier" DOUBLE PRECISION,
ALTER COLUMN "roastLevel" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProductRoast" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "roastId" TEXT NOT NULL,
    "roastMultiplier" DOUBLE PRECISION,

    CONSTRAINT "ProductRoast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductRoast_productId_roastId_key" ON "ProductRoast"("productId", "roastId");

-- AddForeignKey
ALTER TABLE "ProductRoast" ADD CONSTRAINT "ProductRoast_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRoast" ADD CONSTRAINT "ProductRoast_roastId_fkey" FOREIGN KEY ("roastId") REFERENCES "Roast"("id") ON DELETE CASCADE ON UPDATE CASCADE;
