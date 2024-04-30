/*
  Warnings:

  - Added the required column `start_date` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "start_date" TEXT NOT NULL;
