/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `method` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ContractOrderType" AS ENUM ('MARKETING', 'REFER', 'RENEW', 'MEMBER');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CARD', 'QR');

-- AlterTable
ALTER TABLE "public"."Contract" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "orderType" "public"."ContractOrderType",
ADD COLUMN     "paymentMethod" "public"."PaymentMethod";

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "isDeposit" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "method",
ADD COLUMN     "method" "public"."PaymentMethod" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contract_code_key" ON "public"."Contract"("code");
