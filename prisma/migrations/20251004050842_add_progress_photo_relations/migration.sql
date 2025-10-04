-- AlterTable
ALTER TABLE "public"."ProgressPhoto" ADD COLUMN     "uploadedById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."ProgressPhoto" ADD CONSTRAINT "ProgressPhoto_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
