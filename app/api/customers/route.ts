// api/customers/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // lấy user đang đăng nhập
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const branchConnect =
      body.branchId && body.branchId !== ""
        ? { connect: { id: body.branchId } }
        : { connect: { id: "ALL" } }; // gán mặc định ALL nếu không có

    // Gán mặc định createdBy và careCoach = user hiện tại
    const newCustomer = await prisma.customer.create({
      data: {
        code: body.code,
        type: body.type, // "ADULT" | "CHILD" | ...
        fullName: body.fullName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        avatarUrl: body.avatarUrl,

        nationalId: body.nationalId,
        currentAddress: body.currentAddress,
        height: body.height ? parseFloat(body.height) : null,
        weight: body.weight ? parseFloat(body.weight) : null,

        guardianName: body.guardianName,
        guardianPhone: body.guardianPhone,
        guardianZalo: body.guardianZalo,

        zaloPhone: body.zaloPhone,
        needs: body.needs,
        source: body.source, // phải là enum CustomerSource hợp lệ

        branch: branchConnect,

        // careCoach = user hiện tại (nếu cần bạn có thể query để map sang Member.id)
        careCoach: {
          connect: { userId },
        },
        createdBy: {
          connect: { userId },
        },

        phones: body.phones
          ? {
              create: body.phones.map((p: any) => ({
                phone: p.phone,
                label: p.label,
                isPrimary: p.isPrimary,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(newCustomer);
  } catch (err) {
    console.error("❌ Error creating customer:", err);
    return NextResponse.json(
      { error: "Error creating customer" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        branch: true,
        careCoach: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(customers);
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
    return NextResponse.json(
      { error: "Error fetching customers" },
      { status: 500 }
    );
  }
}
