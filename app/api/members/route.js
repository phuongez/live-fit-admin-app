import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get("branchId");

    const where = {
        role: { in: ["JUNIOR", "SERVICE", "SENIOR", "SUPERVISOR", "MANAGER", "ADMIN"] },
    };

    // Nếu có branchId → lọc theo chi nhánh
    if (branchId && branchId !== "ALL") {
        where.branches = {
            some: { branchId },
        };
    }

    const members = await prisma.member.findMany({
        where,
        select: {
            id: true,
            fullName: true,
            role: true,
            branches: { select: { branchId: true } },
        },
    });

    return NextResponse.json(members);
}
