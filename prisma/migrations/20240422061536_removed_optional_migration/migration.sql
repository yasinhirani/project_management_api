/*
  Warnings:

  - Made the column `linkedin_link` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `facebook_link` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `target_audience` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `referral_source` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `client_expectation` on table `clients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "linkedin_link" SET NOT NULL,
ALTER COLUMN "facebook_link" SET NOT NULL,
ALTER COLUMN "target_audience" SET NOT NULL,
ALTER COLUMN "referral_source" SET NOT NULL,
ALTER COLUMN "client_expectation" SET NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "project_logo" SET DEFAULT '{}';
