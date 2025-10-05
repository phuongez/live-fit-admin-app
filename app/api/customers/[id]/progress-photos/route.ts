import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

/**
 * Lấy danh sách ảnh tiến bộ của 1 khách hàng
 * GET /api/customers/[id]/progress-photos
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    const photos = await prisma.progressPhoto.findMany({
      where: { customerId },
      orderBy: { takenAt: "desc" },
      include: {
        uploadedBy: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json(photos);
  } catch (err) {
    console.error("❌ Error fetching progress photos:", err);
    return NextResponse.json(
      { error: "Error fetching progress photos" },
      { status: 500 }
    );
  }
}

/**
 * Thêm ảnh tiến bộ mới cho khách hàng
 * POST /api/customers/[id]/progress-photos
 * body: { url: string, takenAt?: string }
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, takenAt } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing photo URL" }, { status: 400 });
    }

    // Tìm Member tương ứng với userId Clerk
    const member = await prisma.member.findUnique({
      where: { userId },
      select: { id: true },
    });

    const photo = await prisma.progressPhoto.create({
      data: {
        customer: { connect: { id: params.id } },
        url,
        takenAt: takenAt ? new Date(takenAt) : new Date(),
        uploadedBy: member ? { connect: { id: member.id } } : undefined,
      },
      include: {
        uploadedBy: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return NextResponse.json(photo);
  } catch (err) {
    console.error("❌ Error creating progress photo:", err);
    return NextResponse.json(
      { error: "Error creating progress photo" },
      { status: 500 }
    );
  }
}
