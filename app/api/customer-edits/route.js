import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET – danh sách yêu cầu chờ duyệt
export async function GET() {
    const edits = await prisma.customerEditRequest.findMany({
        where: { status: "PENDING" },
        include: { customer: true, requestedBy: true },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(edits);
}

// POST – nhân viên gửi yêu cầu duyệt
export async function POST(req) {
    const body = await req.json();
    const { customerId, changes, note, requestedById } = body;

    if (!customerId || !requestedById || !changes)
        return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });

    const edit = await prisma.customerEditRequest.create({
        data: {
            customerId,
            changes,
            note,
            requestedById,
        },
    });

    return NextResponse.json(edit, { status: 201 });
}

// PATCH – Quản lý duyệt
export async function PATCH(req) {
    const body = await req.json();
    const { id, action, approverId } = body;

    const edit = await prisma.customerEditRequest.update({
        where: { id },
        data: {
            status: action === "approve" ? "APPROVED" : "REJECTED",
            approvedById: approverId,
            reviewedAt: new Date(),
        },
    });

    if (edit.status === "APPROVED") {
        const full = await prisma.customerEditRequest.findUnique({
            where: { id },
        });

        await prisma.customer.update({
            where: { id: full.customerId },
            data: full.changes, // 🔹 cập nhật tất cả trường đã sửa
        });
    }

    return NextResponse.json(edit);
}
