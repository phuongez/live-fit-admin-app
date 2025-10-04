-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "currentAddress" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "nationalId" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."ProgressPhoto" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProgressPhoto" ADD CONSTRAINT "ProgressPhoto_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
