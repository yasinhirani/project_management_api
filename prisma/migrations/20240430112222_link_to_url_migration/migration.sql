/*
  Warnings:

  - You are about to drop the column `facebook_link` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin_link` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "facebook_link",
DROP COLUMN "linkedin_link",
ADD COLUMN     "facebook_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "linkedin_url" TEXT NOT NULL DEFAULT '';
