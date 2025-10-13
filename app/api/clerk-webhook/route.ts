import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const payload: WebhookEvent = await req.json();
    console.log("📩 Clerk webhook:", JSON.stringify(payload, null, 2));

    if (payload.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        payload.data;

      const fullName =
        [first_name, last_name].filter(Boolean).join(" ") || "Unnamed";

      try {
        const newMember = await prisma.member.create({
          data: {
            userId: id,
            fullName,
            avatarUrl: image_url,
            email: email_addresses?.[0]?.email_address ?? null,
          },
        });
        // 🔹 2. Cập nhật lại publicMetadata của user trong Clerk
        await fetch(`https://api.clerk.com/v1/users/${clerkId}/metadata`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${process.env.CLERK_WEBHOOK_SECRET}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            public_metadata: { memberId: newMember.id },
          }),
        });
        console.log(`✅ Created member for userId=${id}`);
      } catch (dbErr: any) {
        console.error("❌ Prisma create error:", dbErr);
        // Nếu unique constraint fail thì bỏ qua, vẫn trả 200
      }
    }

    if (payload.type === "user.deleted") {
      const { id } = payload.data;

      try {
        await prisma.member.delete({
          where: { userId: id },
        });
        console.log(`🗑️ Deleted member for userId=${id}`);
      } catch (dbErr: any) {
        console.error("❌ Prisma delete error:", dbErr);
        // Nếu user không tồn tại thì bỏ qua
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error handling Clerk webhook:", err);
    // Trả về 200 để Clerk không retry vô hạn
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 200 }
    );
  }
}
