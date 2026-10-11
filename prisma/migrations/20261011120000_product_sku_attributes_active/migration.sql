-- AlterTable
ALTER TABLE "Product" ADD COLUMN "sku" TEXT,
ADD COLUMN "attributes" TEXT[],
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

UPDATE "Product" SET "attributes" = ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
