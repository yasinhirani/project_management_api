-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "linkedin_link" DROP NOT NULL,
ALTER COLUMN "facebook_link" DROP NOT NULL,
ALTER COLUMN "target_audience" DROP NOT NULL,
ALTER COLUMN "target_audience" SET DEFAULT '',
ALTER COLUMN "referral_source" DROP NOT NULL,
ALTER COLUMN "referral_source" SET DEFAULT '',
ALTER COLUMN "client_expectation" DROP NOT NULL,
ALTER COLUMN "client_expectation" SET DEFAULT '';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
