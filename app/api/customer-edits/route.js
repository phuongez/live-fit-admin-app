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
    try {
        const body = await req.json();
        const { id, action, approverId } = body;

        if (!id || !action || !approverId) {
            return NextResponse.json(
                { error: "Thiếu thông tin yêu cầu (id, action, approverId)" },
                { status: 400 }
            );
        }

        // 🔹 1. Cập nhật trạng thái yêu cầu
        const edit = await prisma.customerEditRequest.update({
            where: { id },
            data: {
                status: action === "approve" ? "APPROVED" : "REJECTED",
                approvedById: approverId,
                reviewedAt: new Date(),
            },
        });

        // 🔹 2. Nếu phê duyệt → cập nhật thông tin khách hàng
        if (edit.status === "APPROVED") {
            const full = await prisma.customerEditRequest.findUnique({
                where: { id },
                include: { customer: true },
            });

            if (!full?.changes) {
                return NextResponse.json(
                    { error: "Không tìm thấy dữ liệu thay đổi" },
                    { status: 400 }
                );
            }

            const changes = full.changes;
            const { phones, ...otherFields } = changes;

            // Dùng transaction để tránh lỗi khi xoá – thêm số điện thoại
            await prisma.$transaction(async (tx) => {
                // 🔹 Cập nhật các trường cơ bản
                if (Object.keys(otherFields).length > 0) {
                    await tx.customer.update({
                        where: { id: full.customerId },
                        data: otherFields,
                    });
                }

                // 🔹 Nếu có thay đổi số điện thoại
                if (phones && Array.isArray(phones)) {
                    await tx.customerPhone.deleteMany({
                        where: { customerId: full.customerId },
                    });

                    await tx.customer.update({
                        where: { id: full.customerId },
                        data: {
                            phones: {
                                create: phones.map((p) => ({
                                    phone: p.phone,
                                    label: p.label || (p.isPrimary ? "Chính" : "Phụ"),
                                    isPrimary: p.isPrimary || false,
                                })),
                            },
                        },
                    });
                }
            });
        }

        // 🔹 3. Trả kết quả về client
        const result = await prisma.customerEditRequest.findUnique({
            where: { id },
            include: {
                customer: {
                    include: { phones: true },
                },
                requestedBy: true,
                approvedBy: true,
            },
        });

        return NextResponse.json(result);
    } catch (err) {
        console.error("PATCH /api/customer-edits error:", err);
        return NextResponse.json(
            { error: "Lỗi khi xử lý yêu cầu phê duyệt khách hàng" },
            { status: 500 }
        );
    }
}
