/*
  Warnings:

  - A unique constraint covering the columns `[ref]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ref` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories"
    ADD COLUMN "ref" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categories_ref_key" ON "Categories" ("ref");
