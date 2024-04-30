/*
  Warnings:

  - Added the required column `emp_id` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "emp_id" TEXT NOT NULL;
