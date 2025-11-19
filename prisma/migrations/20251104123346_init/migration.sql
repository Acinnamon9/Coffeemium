-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roast" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roastLevel" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "roastMultiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Roast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrindOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extraCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GrindOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Roast" ADD CONSTRAINT "Roast_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
