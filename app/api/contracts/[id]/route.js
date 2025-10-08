import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========== PATCH /api/contracts/[id] ==========
export async function PATCH(req, { params }) {
    try {
        const id = params.id;
        const body = await req.json();

        const {
            updates,     // dữ liệu muốn cập nhật
            approverId,  // ID người thực hiện duyệt (Member.id)
            role,        // Vai trò của người thực hiện
            note,
        } = body;

        // ===== 1️⃣ Kiểm tra quyền =====
        if (!approverId || !role) {
            return NextResponse.json(
                { error: "Thiếu thông tin người thực hiện hoặc vai trò" },
                { status: 400 }
            );
        }

        if (!["MANAGER", "ADMIN"].includes(role)) {
            return NextResponse.json(
                { error: "Bạn không có quyền duyệt hoặc chỉnh sửa hợp đồng" },
                { status: 403 }
            );
        }

        // ===== 2️⃣ Lấy hợp đồng hiện tại =====
        const existing = await prisma.contract.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Không tìm thấy hợp đồng" }, { status: 404 });
        }

        // ===== 3️⃣ Cập nhật =====
        const updated = await prisma.contract.update({
            where: { id },
            data: {
                ...updates,
                isApproved: true,
                approvedById: approverId,
                note,
            },
            include: {
                primaryCustomer: true,
                serviceCoach: true,
                payments: true,
                approvedBy: true,
            },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("PATCH /api/contracts/[id] error:", err);
        return NextResponse.json(
            { error: "Cập nhật hợp đồng thất bại" },
            { status: 500 }
        );
    }
}

export async function GET(req, { params }) {
    const contract = await prisma.contract.findUnique({
        where: { id: params.id },
        include: {
            primaryCustomer: true,
            serviceCoach: true,
            payments: true,
            approvedBy: true,
        },
    });

    if (!contract) {
        return NextResponse.json({ error: "Không tìm thấy hợp đồng" }, { status: 404 });
    }

    return NextResponse.json(contract);
}
