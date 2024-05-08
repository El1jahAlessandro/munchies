/*
  Warnings:

  - Added the required column `price` to the `OrdersArticles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrdersArticles"
    ADD COLUMN "price" INTEGER NOT NULL;
