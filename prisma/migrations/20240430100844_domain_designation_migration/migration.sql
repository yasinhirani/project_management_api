-- CreateTable
CREATE TABLE "domains_list" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "domains_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations_list" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "designations_list_pkey" PRIMARY KEY ("id")
);
