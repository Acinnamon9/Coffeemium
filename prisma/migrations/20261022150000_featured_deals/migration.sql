CREATE TABLE "FeaturedDeal" (
    "id" TEXT NOT NULL DEFAULT 'primary',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "discountPercent" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FeaturedDeal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeaturedDealProduct" (
    "dealId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "FeaturedDealProduct_pkey" PRIMARY KEY ("dealId", "productId")
);

ALTER TABLE "FeaturedDealProduct" ADD CONSTRAINT "FeaturedDealProduct_dealId_fkey"
FOREIGN KEY ("dealId") REFERENCES "FeaturedDeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeaturedDealProduct" ADD CONSTRAINT "FeaturedDealProduct_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
