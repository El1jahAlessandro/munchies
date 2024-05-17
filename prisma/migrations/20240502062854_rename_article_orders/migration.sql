/*
  Warnings:

  - You are about to drop the `ArticleOrders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `totalPrice` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleOrders" DROP CONSTRAINT "ArticleOrders_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleOrders" DROP CONSTRAINT "ArticleOrders_orderId_fkey";

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "totalPrice" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ArticleOrders";

-- CreateTable
CREATE TABLE "OrdersArticles" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdersArticles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrdersArticles" ADD CONSTRAINT "OrdersArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersArticles" ADD CONSTRAINT "OrdersArticles_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
