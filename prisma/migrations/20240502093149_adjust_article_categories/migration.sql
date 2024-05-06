/*
  Warnings:

  - You are about to drop the column `articleCategoriesId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `ArticleCategories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ArticleCategories` table. All the data in the column will be lost.
  - Added the required column `articleId` to the `ArticleCategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `ArticleCategories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_articleCategoriesId_fkey";

-- DropIndex
DROP INDEX "ArticleCategories_name_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "articleCategoriesId";

-- AlterTable
ALTER TABLE "ArticleCategories" DROP COLUMN "icon",
DROP COLUMN "name",
ADD COLUMN     "articleId" INTEGER NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "status" SET DEFAULT 'inPreparation';

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- AddForeignKey
ALTER TABLE "ArticleCategories" ADD CONSTRAINT "ArticleCategories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCategories" ADD CONSTRAINT "ArticleCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
