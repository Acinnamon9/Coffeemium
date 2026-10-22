ALTER TABLE "CartItem" ADD COLUMN "packageGrams" INTEGER NOT NULL DEFAULT 250;
ALTER TABLE "OrderItem" ADD COLUMN "packageGrams" INTEGER NOT NULL DEFAULT 250;

UPDATE "CartItem" AS item
SET "packageGrams" = COALESCE(NULLIF(substring(product."name" from '([0-9]+)g'), '')::integer, 250)
FROM "Product" AS product
WHERE item."productId" = product."id";

UPDATE "OrderItem" AS item
SET "packageGrams" = COALESCE(NULLIF(substring(product."name" from '([0-9]+)g'), '')::integer, 250)
FROM "Product" AS product
WHERE item."productId" = product."id";

DROP INDEX IF EXISTS "CartItem_cartId_productId_roastId_grindOptionId_bundleId_key";
CREATE UNIQUE INDEX "CartItem_product_package_key"
ON "CartItem" ("cartId", "productId", "roastId", "grindOptionId", "bundleId", "packageGrams");

DROP INDEX IF EXISTS "OrderItem_orderId_productId_roastId_grindOptionId_key";
CREATE UNIQUE INDEX "OrderItem_product_package_key"
ON "OrderItem" ("orderId", "productId", "roastId", "grindOptionId", "packageGrams");
