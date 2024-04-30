-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "assigned_project_ids" TEXT[];

-- AddForeignKey
ALTER TABLE "staffing_details" ADD CONSTRAINT "staffing_details_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
