-- AlterTable
ALTER TABLE "public"."Contract" ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "note" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
