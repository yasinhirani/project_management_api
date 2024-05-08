/*
  Warnings:

  - You are about to drop the column `emp_id` on the `employees` table. All the data in the column will be lost.
  - Added the required column `emp_code` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "emp_id",
ADD COLUMN     "emp_code" TEXT NOT NULL;
