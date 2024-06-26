/*
  Warnings:

  - The primary key for the `Article` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ArticleCategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrdersArticles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accountType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleCategories" DROP CONSTRAINT "ArticleCategories_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleCategories" DROP CONSTRAINT "ArticleCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrdersArticles" DROP CONSTRAINT "OrdersArticles_articleId_fkey";

-- DropForeignKey
ALTER TABLE "OrdersArticles" DROP CONSTRAINT "OrdersArticles_orderId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP CONSTRAINT "Article_pkey",
ALTER
COLUMN "id" DROP
DEFAULT,
ALTER
COLUMN "id" SET DATA TYPE TEXT,
ALTER
COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Article_id_seq";

-- AlterTable
ALTER TABLE "ArticleCategories" DROP CONSTRAINT "ArticleCategories_pkey",
ALTER
COLUMN "id" DROP
DEFAULT,
ALTER
COLUMN "id" SET DATA TYPE TEXT,
ALTER
COLUMN "articleId" SET DATA TYPE TEXT,
ALTER
COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ArticleCategories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ArticleCategories_id_seq";

-- AlterTable
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pkey",
ALTER
COLUMN "id" DROP
DEFAULT,
ALTER
COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Categories_id_seq";

-- AlterTable
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_pkey",
ALTER
COLUMN "id" DROP
DEFAULT,
ALTER
COLUMN "id" SET DATA TYPE TEXT,
ALTER
COLUMN "userId" SET DATA TYPE TEXT,
ALTER
COLUMN "companyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Orders_id_seq";

-- AlterTable
ALTER TABLE "OrdersArticles" DROP CONSTRAINT "OrdersArticles_pkey",
ALTER
COLUMN "id" DROP
DEFAULT,
ALTER
COLUMN "id" SET DATA TYPE TEXT,
ALTER
COLUMN "articleId" SET DATA TYPE TEXT,
ALTER
COLUMN "orderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrdersArticles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrdersArticles_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP
COLUMN "accountType",
DROP
COLUMN "profilePic",
ADD COLUMN     "account_type" "AccountType" NOT NULL DEFAULT 'user',
ADD COLUMN     "profile_pic" TEXT,
ALTER
COLUMN "id" DROP
DEFAULT,
ALTER
COLUMN "id" SET DATA TYPE TEXT,
ALTER
COLUMN "password" DROP
NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Article"
    ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersArticles"
    ADD CONSTRAINT "OrdersArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersArticles"
    ADD CONSTRAINT "OrdersArticles_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders"
    ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders"
    ADD CONSTRAINT "Orders_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCategories"
    ADD CONSTRAINT "ArticleCategories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCategories"
    ADD CONSTRAINT "ArticleCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
