import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===== GET: Danh sách yêu cầu chờ duyệt =====
export async function GET(req) {
    try {
        const edits = await prisma.customerEditRequest.findMany({
            where: { status: "PENDING" },
            include: {
                customer: true,
                requestedBy: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(edits);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Lỗi khi tải danh sách" }, { status: 500 });
    }
}

// ===== POST: Nhân viên tạo yêu cầu chỉnh sửa =====
export async function POST(req) {
    try {
        const body = await req.json();
        const { customerId, field, oldValue, newValue, note, requestedById } = body;

        const edit = await prisma.customerEditRequest.create({
            data: { customerId, field, oldValue, newValue, note, requestedById },
        });

        return NextResponse.json(edit, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Tạo yêu cầu thất bại" }, { status: 500 });
    }
}

// ===== PATCH: Manager/Admin duyệt hoặc từ chối =====
export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, action, approverId } = body;

        const status = action === "approve" ? "APPROVED" : "REJECTED";

        const updated = await prisma.customerEditRequest.update({
            where: { id },
            data: {
                status,
                approvedById: approverId,
                reviewedAt: new Date(),
            },
            include: {
                customer: true,
            },
        });

        // Nếu duyệt → cập nhật trực tiếp vào bảng Customer
        if (status === "APPROVED") {
            await prisma.customer.update({
                where: { id: updated.customerId },
                data: {
                    [updated.field]: updated.newValue,
                },
            });
        }

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 500 });
    }
}
