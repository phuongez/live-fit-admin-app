// /app/api/customers/next-code/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch") || "ALL";

    // Đếm số khách hàng hiện tại trong branch
    const count = await prisma.customer.count({
      where: {
        branch: {
          id: branch,
        },
      },
    });

    // Sinh số tiếp theo
    const nextNumber = count + 1;
    const padded = String(nextNumber).padStart(6, "0");

    const code = `LF-${branch}-${padded}`;

    return NextResponse.json({ next: nextNumber, code });
  } catch (err) {
    console.error("Error generating next customer code:", err);
    return NextResponse.json(
      { error: "Failed to generate code" },
      { status: 500 }
    );
  }
}
