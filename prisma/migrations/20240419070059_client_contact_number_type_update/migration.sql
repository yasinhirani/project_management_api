/*
  Warnings:

  - You are about to alter the column `contact_number` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "contact_number" SET DATA TYPE INTEGER;
