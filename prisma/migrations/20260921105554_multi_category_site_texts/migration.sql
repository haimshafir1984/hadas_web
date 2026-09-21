-- CreateTable
CREATE TABLE "SiteText" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SiteText_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "_ProductExtraCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductExtraCategories_AB_unique" ON "_ProductExtraCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductExtraCategories_B_index" ON "_ProductExtraCategories"("B");

-- AddForeignKey
ALTER TABLE "_ProductExtraCategories" ADD CONSTRAINT "_ProductExtraCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductExtraCategories" ADD CONSTRAINT "_ProductExtraCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
