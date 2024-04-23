-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "projects" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "contract_documents" SET DEFAULT ARRAY[]::JSONB[];
