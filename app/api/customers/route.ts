// api/customers/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      dateOfBirth,
      gender,
      type,
      phone,
      zaloPhone,
      needs,
      source,
      guardianName,
      guardianPhone,
      guardianZalo,
      branch,
      customerCode,
      avatarUrl,
    } = body;

    const newCustomer = await prisma.customer.create({
      data: {
        fullName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        type,
        needs,
        source,
        avatarUrl,
        guardianName,
        guardianPhone,
        guardianZalo,
        branch: {
          connect: { id: branch }, // giả sử branch.id = "BTX", "ALL"...
        },
        phones: {
          create: [
            {
              phone: phone,
              label: "main",
              isPrimary: true,
            },
            ...(zaloPhone
              ? [
                  {
                    phone: zaloPhone,
                    label: "zalo",
                    isPrimary: false,
                  },
                ]
              : []),
          ],
        },
        // gán code cho khách hàng
        // bạn cần có field `code` trong model Customer
        code: customerCode,
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (err: any) {
    console.error("Error creating customer:", err);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
