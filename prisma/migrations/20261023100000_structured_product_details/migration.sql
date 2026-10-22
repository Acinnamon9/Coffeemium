ALTER TABLE "ProductDetail"
  ADD COLUMN "origin" TEXT,
  ADD COLUMN "tastingNotes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "body" INTEGER,
  ADD COLUMN "acidity" INTEGER,
  ADD COLUMN "sweetness" INTEGER,
  ADD COLUMN "bitterness" INTEGER,
  ADD COLUMN "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "roastProfiles" JSONB;
