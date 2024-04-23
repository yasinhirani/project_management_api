-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_description" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,
    "software_category" TEXT NOT NULL,
    "project_budget" JSONB NOT NULL,
    "project_budget_type" TEXT NOT NULL,
    "assigned_client_id" TEXT NOT NULL,
    "project_priority" TEXT NOT NULL,
    "project_status" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "project_logo" JSONB NOT NULL,
    "project_documents" JSONB[],
    "assigned_resources" JSONB[],

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_assigned_client_id_fkey" FOREIGN KEY ("assigned_client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
