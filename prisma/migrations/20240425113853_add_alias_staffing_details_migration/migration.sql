/*
  Warnings:

  - You are about to drop the column `allocatedHours` on the `staffing_details` table. All the data in the column will be lost.
  - You are about to drop the column `endDateOfAllocation` on the `staffing_details` table. All the data in the column will be lost.
  - You are about to drop the column `isForcedStaffed` on the `staffing_details` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `staffing_details` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `staffing_details` table. All the data in the column will be lost.
  - You are about to drop the column `startDateOfAllocation` on the `staffing_details` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `staffing_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_id` to the `staffing_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "staffing_details" DROP COLUMN "allocatedHours",
DROP COLUMN "endDateOfAllocation",
DROP COLUMN "isForcedStaffed",
DROP COLUMN "projectId",
DROP COLUMN "resourceId",
DROP COLUMN "startDateOfAllocation",
ADD COLUMN     "allocated_hours" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "end_date_of_allocation" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "is_forced_staffed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "project_id" TEXT NOT NULL,
ADD COLUMN     "resource_id" TEXT NOT NULL,
ADD COLUMN     "start_date_of_allocation" TEXT NOT NULL DEFAULT '';
