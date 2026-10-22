ALTER TABLE "Product" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'single-origin';

UPDATE "Product"
SET "category" = CASE
  WHEN LOWER("name" || ' ' || "description") LIKE '%instant%' THEN 'instant'
  WHEN LOWER("name" || ' ' || "description") LIKE '%grind%'
    OR LOWER("name" || ' ' || "description") LIKE '%moka pot%'
    OR LOWER("name" || ' ' || "description") LIKE '%french press%'
    OR LOWER("name" || ' ' || "description") LIKE '%aeropress%'
    OR LOWER("name" || ' ' || "description") LIKE '%pour over%'
    OR LOWER("name" || ' ' || "description") LIKE '%espresso machine%' THEN 'grinds'
  WHEN LOWER("name" || ' ' || "description") LIKE '%flavor%'
    OR LOWER("name" || ' ' || "description") LIKE '%infused%'
    OR LOWER("name" || ' ' || "description") LIKE '%mocha%'
    OR LOWER("name" || ' ' || "description") LIKE '%vanilla%'
    OR LOWER("name" || ' ' || "description") LIKE '%hazelnut%'
    OR LOWER("name" || ' ' || "description") LIKE '%cinnamon%'
    OR LOWER("name" || ' ' || "description") LIKE '%caramel%'
    OR LOWER("name" || ' ' || "description") LIKE '%irish cream%'
    OR LOWER("name" || ' ' || "description") LIKE '%coconut%' THEN 'flavored'
  WHEN LOWER("name" || ' ' || "description") LIKE '%blend%' THEN 'blends'
  ELSE 'single-origin'
END;
