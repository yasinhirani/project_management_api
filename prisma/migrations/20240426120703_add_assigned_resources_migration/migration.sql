-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "assigned_resources" TEXT[];

-- AddForeignKey
ALTER TABLE "staffing_details" ADD CONSTRAINT "staffing_details_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
