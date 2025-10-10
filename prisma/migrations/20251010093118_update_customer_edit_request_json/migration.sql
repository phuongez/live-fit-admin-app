/*
  Warnings:

  - You are about to drop the column `field` on the `CustomerEditRequest` table. All the data in the column will be lost.
  - You are about to drop the column `newValue` on the `CustomerEditRequest` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `CustomerEditRequest` table. All the data in the column will be lost.
  - Added the required column `changes` to the `CustomerEditRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CustomerEditRequest" DROP COLUMN "field",
DROP COLUMN "newValue",
DROP COLUMN "oldValue",
ADD COLUMN     "changes" JSONB NOT NULL;
