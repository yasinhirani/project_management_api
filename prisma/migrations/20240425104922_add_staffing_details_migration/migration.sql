/*
  Warnings:

  - You are about to drop the column `designations` on the `staffing_details` table. All the data in the column will be lost.
  - You are about to drop the column `domain` on the `staffing_details` table. All the data in the column will be lost.
  - You are about to drop the `assigned_resources` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `resourceId` to the `staffing_details` table without a default value. This is not possible if the table is not empty.
  - Made the column `projectId` on table `staffing_details` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "assigned_resources" DROP CONSTRAINT "assigned_resources_employee_Id_fkey";

-- DropForeignKey
ALTER TABLE "assigned_resources" DROP CONSTRAINT "assigned_resources_project_id_fkey";

-- DropForeignKey
ALTER TABLE "assigned_resources" DROP CONSTRAINT "assigned_resources_staffingDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "staffing_details" DROP CONSTRAINT "staffing_details_projectId_fkey";

-- AlterTable
ALTER TABLE "staffing_details" DROP COLUMN "designations",
DROP COLUMN "domain",
ADD COLUMN     "allocatedHours" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "endDateOfAllocation" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isForcedStaffed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resourceId" TEXT NOT NULL,
ADD COLUMN     "startDateOfAllocation" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "projectId" SET NOT NULL;

-- DropTable
DROP TABLE "assigned_resources";
