/*
  Warnings:

  - Added the required column `date_of_birth` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain_lead` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_shift` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employment_type` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporting_office` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "blood_group" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "date_of_birth" TEXT NOT NULL,
ADD COLUMN     "domain_lead" TEXT NOT NULL,
ADD COLUMN     "employeeDocuments" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "employee_shift" TEXT NOT NULL,
ADD COLUMN     "employment_type" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "languages" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "marital_status" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "reporting_office" TEXT NOT NULL,
ADD COLUMN     "skills" JSONB[] DEFAULT ARRAY[]::JSONB[],
ALTER COLUMN "assigned_project_ids" SET DEFAULT ARRAY[]::TEXT[];
