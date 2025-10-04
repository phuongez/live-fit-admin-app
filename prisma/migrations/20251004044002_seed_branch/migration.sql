-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('JUNIOR', 'SENIOR', 'SERVICE', 'SUPERVISOR', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."CustomerType" AS ENUM ('ADULT', 'CHILD');

-- CreateEnum
CREATE TYPE "public"."CustomerStage" AS ENUM ('LEAD', 'DATA', 'APPOINTMENT', 'TRIAL', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "public"."CustomerSource" AS ENUM ('REFERRAL', 'HOTLINE', 'CARE', 'COACH', 'UID', 'GOOGLE_ADS', 'TIKTOK_ADS', 'WEBSITE');

-- CreateEnum
CREATE TYPE "public"."ContractCategory" AS ENUM ('STANDARD', 'GIFT');

-- CreateEnum
CREATE TYPE "public"."ContractAudience" AS ENUM ('ADULT', 'CHILD');

-- CreateEnum
CREATE TYPE "public"."ContractModality" AS ENUM ('ONE_ON_ONE', 'ONE_ON_TWO');

-- CreateEnum
CREATE TYPE "public"."ContractStatus" AS ENUM ('ACTIVE', 'FROZEN', 'EXHAUSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ScheduleStatus" AS ENUM ('BOOKED', 'DONE', 'NO_SHOW', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MemberBranch" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "roleInBranch" "public"."Role" NOT NULL,

    CONSTRAINT "MemberBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'SERVICE',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationalId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "currentAddress" TEXT,
    "permanentAddress" TEXT,
    "bankAccount" TEXT,
    "bankName" TEXT,
    "bankHolder" TEXT,
    "startDate" TIMESTAMP(3),
    "achievements" TEXT,
    "experience" TEXT,
    "certificates" TEXT,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "public"."CustomerType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "avatarUrl" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianZalo" TEXT,
    "zaloPhone" TEXT,
    "needs" TEXT,
    "source" "public"."CustomerSource",
    "stage" "public"."CustomerStage" NOT NULL DEFAULT 'LEAD',
    "branchId" TEXT NOT NULL,
    "careCoachId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomerPhone" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "label" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CustomerPhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomerStageLog" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "fromStage" "public"."CustomerStage",
    "toStage" "public"."CustomerStage" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" TEXT,
    "note" TEXT,

    CONSTRAINT "CustomerStageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "id" TEXT NOT NULL,
    "category" "public"."ContractCategory" NOT NULL,
    "audience" "public"."ContractAudience" NOT NULL,
    "modality" "public"."ContractModality" NOT NULL,
    "primaryCustomerId" TEXT,
    "sellerId" TEXT,
    "serviceCoachId" TEXT,
    "branchId" TEXT NOT NULL,
    "totalSessions" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "pricePerSession" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "public"."ContractStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContractParticipant" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "ContractParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "contractId" TEXT,
    "coachId" TEXT NOT NULL,
    "roomId" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."ScheduleStatus" NOT NULL DEFAULT 'BOOKED',
    "sessionId" TEXT,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "coachId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "consumeNote" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SessionAttendance" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,

    CONSTRAINT "SessionAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KPIAssignment" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "salesTarget" DECIMAL(12,2),
    "sessionsTarget" INTEGER,
    "renewRateTarget" DECIMAL(5,2),
    "newContractsTarget" INTEGER,
    "assignedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KPIAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KPILog" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sessionsTaught" INTEGER NOT NULL DEFAULT 0,
    "renewRate" DECIMAL(5,2),
    "newContracts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "KPILog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payroll" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "base" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "perSession" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "commission" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "bonus" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "penalty" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberBranch_memberId_branchId_key" ON "public"."MemberBranch"("memberId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "public"."Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_code_key" ON "public"."Customer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPhone_customerId_phone_key" ON "public"."CustomerPhone"("customerId", "phone");

-- CreateIndex
CREATE INDEX "CustomerStageLog_customerId_changedAt_idx" ON "public"."CustomerStageLog"("customerId", "changedAt");

-- CreateIndex
CREATE INDEX "Contract_branchId_idx" ON "public"."Contract"("branchId");

-- CreateIndex
CREATE INDEX "Contract_sellerId_idx" ON "public"."Contract"("sellerId");

-- CreateIndex
CREATE INDEX "Contract_serviceCoachId_idx" ON "public"."Contract"("serviceCoachId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractParticipant_contractId_customerId_key" ON "public"."ContractParticipant"("contractId", "customerId");

-- CreateIndex
CREATE INDEX "Payment_contractId_paidAt_idx" ON "public"."Payment"("contractId", "paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_sessionId_key" ON "public"."Schedule"("sessionId");

-- CreateIndex
CREATE INDEX "Schedule_branchId_startsAt_idx" ON "public"."Schedule"("branchId", "startsAt");

-- CreateIndex
CREATE INDEX "Schedule_coachId_startsAt_idx" ON "public"."Schedule"("coachId", "startsAt");

-- CreateIndex
CREATE INDEX "Session_branchId_startedAt_idx" ON "public"."Session"("branchId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SessionAttendance_sessionId_customerId_key" ON "public"."SessionAttendance"("sessionId", "customerId");

-- CreateIndex
CREATE UNIQUE INDEX "KPIAssignment_memberId_month_year_key" ON "public"."KPIAssignment"("memberId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "KPILog_memberId_month_year_key" ON "public"."KPILog"("memberId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_memberId_month_year_key" ON "public"."Payroll"("memberId", "month", "year");

-- AddForeignKey
ALTER TABLE "public"."MemberBranch" ADD CONSTRAINT "MemberBranch_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MemberBranch" ADD CONSTRAINT "MemberBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_careCoachId_fkey" FOREIGN KEY ("careCoachId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerPhone" ADD CONSTRAINT "CustomerPhone_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerStageLog" ADD CONSTRAINT "CustomerStageLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerStageLog" ADD CONSTRAINT "CustomerStageLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_primaryCustomerId_fkey" FOREIGN KEY ("primaryCustomerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_serviceCoachId_fkey" FOREIGN KEY ("serviceCoachId") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractParticipant" ADD CONSTRAINT "ContractParticipant_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractParticipant" ADD CONSTRAINT "ContractParticipant_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SessionAttendance" ADD CONSTRAINT "SessionAttendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SessionAttendance" ADD CONSTRAINT "SessionAttendance_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KPIAssignment" ADD CONSTRAINT "KPIAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "public"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KPIAssignment" ADD CONSTRAINT "KPIAssignment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KPILog" ADD CONSTRAINT "KPILog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payroll" ADD CONSTRAINT "Payroll_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
