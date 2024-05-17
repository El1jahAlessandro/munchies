/*
  Warnings:

  - Added the required column `companyId` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders"
    ADD COLUMN "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders"
    ADD CONSTRAINT "Orders_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
