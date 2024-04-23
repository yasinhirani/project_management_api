-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "projectIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
