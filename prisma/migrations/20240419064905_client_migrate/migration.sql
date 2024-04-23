-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_number" DECIMAL(65,30) NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "linkedin_link" TEXT NOT NULL,
    "facebook_link" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_address" TEXT NOT NULL,
    "date_of_establishment" TEXT NOT NULL,
    "industry_type" TEXT[],
    "preferred_communication_method" TEXT[],
    "preferred_communication_language" TEXT[],
    "preferred_meeting_time" TEXT NOT NULL,
    "annual_revenue_range" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "referral_source" TEXT NOT NULL,
    "client_expectation" TEXT NOT NULL,
    "projects" TEXT[],
    "contract_documents" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);
