// app/api/customers/[id]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();

    // Chuẩn hoá dữ liệu đầu vào (tránh undefined)
    const dataToUpdate = {
      fullName: body.fullName || undefined,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender: body.gender || undefined,
      avatarUrl: body.avatarUrl || undefined,

      nationalId: body.nationalId || undefined,
      currentAddress: body.currentAddress || undefined,
      height: body.height ? parseFloat(body.height) : undefined,
      weight: body.weight ? parseFloat(body.weight) : undefined,

      guardianName: body.guardianName || undefined,
      guardianPhone: body.guardianPhone || undefined,
      guardianZalo: body.guardianZalo || undefined,

      zaloPhone: body.zaloPhone || undefined,
      needs: body.needs || undefined,
      source: body.source || undefined,
    };

    const updated = await prisma.customer.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ Error updating customer:", err);
    return NextResponse.json(
      { error: "Error updating customer" },
      { status: 500 }
    );
  }
}
