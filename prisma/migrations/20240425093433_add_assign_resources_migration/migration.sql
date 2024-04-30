/*
  Warnings:

  - You are about to drop the column `assigned_resources` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "assigned_resources";

-- CreateTable
CREATE TABLE "staffing_details" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "designations" TEXT[],
    "projectId" TEXT,

    CONSTRAINT "staffing_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assigned_resources" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "employee_Id" TEXT NOT NULL,
    "allocatedHours" JSONB NOT NULL DEFAULT '{}',
    "start_date_of_allocation" TEXT NOT NULL DEFAULT '',
    "end_date_of_allocation" TEXT NOT NULL DEFAULT '',
    "staffingDetailsId" TEXT,

    CONSTRAINT "assigned_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "date_of_joining" TEXT NOT NULL,
    "reporting_manager" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "staffing_details" ADD CONSTRAINT "staffing_details_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_resources" ADD CONSTRAINT "assigned_resources_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_resources" ADD CONSTRAINT "assigned_resources_employee_Id_fkey" FOREIGN KEY ("employee_Id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_resources" ADD CONSTRAINT "assigned_resources_staffingDetailsId_fkey" FOREIGN KEY ("staffingDetailsId") REFERENCES "staffing_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;
