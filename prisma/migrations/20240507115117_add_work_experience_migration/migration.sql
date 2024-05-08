/*
  Warnings:

  - You are about to drop the column `employeeDocuments` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "employeeDocuments",
ADD COLUMN     "employee_documents" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "work_experience" JSONB[] DEFAULT ARRAY[]::JSONB[];
