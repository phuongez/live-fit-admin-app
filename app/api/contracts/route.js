import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // đường dẫn tùy theo cấu trúc dự án
import { Decimal } from "@prisma/client/runtime/library";

// ============ GET: Danh sách hợp đồng với bộ lọc ============
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const code = searchParams.get("code");
        const customerName = searchParams.get("customerName");
        const phone = searchParams.get("phone");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const status = searchParams.get("status");
        const payment = searchParams.get("payment");

        const filters = {};

        // 🔹 Lọc cơ bản
        if (code) filters.code = { contains: code, mode: "insensitive" };
        if (status && status !== "ALL") filters.status = status;

        // 🔹 Lọc theo thời gian tạo
        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) filters.createdAt.gte = new Date(startDate);
            if (endDate) filters.createdAt.lte = new Date(endDate);
        }

        // 🔹 Query chính
        const contracts = await prisma.contract.findMany({
            where: {
                ...filters,
                ...(payment !== "ALL" && payment ? { paymentMethod: payment } : {}),
                ...(customerName || phone
                    ? {
                        primaryCustomer: {
                            ...(customerName && {
                                fullName: { contains: customerName, mode: "insensitive" },
                            }),
                            ...(phone && {
                                OR: [
                                    { zaloPhone: { contains: phone } },
                                    {
                                        phones: {
                                            some: { phone: { contains: phone } },
                                        },
                                    },
                                ],
                            }),
                        },
                    }
                    : {}),
            },
            include: {
                primaryCustomer: {
                    include: { phones: true },
                },
                serviceCoach: true,
                payments: true,
            },
            orderBy: { createdAt: "desc" },
        });

        // 🔹 Tính dư nợ và tổng tiền
        const formatted = contracts.map((c) => {
            const totalValue = Number(c.pricePerSession) * c.totalSessions;
            const paid = c.payments.reduce(
                (sum, p) => sum + Number(p.amount),
                0
            );
            const debt = totalValue - paid;

            return {
                ...c,
                totalValue,
                debt,
            };
        });

        return NextResponse.json(formatted);
    } catch (err) {
        console.error("GET /api/contracts error:", err);
        return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
    }
}

// ============ POST: Tạo hợp đồng mới ============
export async function POST(req) {
    try {
        const body = await req.json();

        const {
            code,
            primaryCustomerId,
            totalSessions,
            pricePerSession,
            orderType,
            paymentMethod,
            branchId,
            sellerId,
            serviceCoachId,
            createdById,
        } = body;

        if (!code || !primaryCustomerId)
            return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });

        const contract = await prisma.contract.create({
            data: {
                code,
                primaryCustomerId,
                totalSessions,
                remaining: totalSessions,
                pricePerSession: new Decimal(pricePerSession),
                orderType,
                paymentMethod,
                branchId,
                sellerId,
                serviceCoachId,
                createdById,
                startDate: new Date(),
                status: "ACTIVE",
            },
        });

        return NextResponse.json(contract, { status: 201 });
    } catch (err) {
        console.error("POST /api/contracts error:", err);
        return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
    }
}
