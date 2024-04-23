-- CreateTable
CREATE TABLE "countries_list" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "countries_list_pkey" PRIMARY KEY ("id")
);
