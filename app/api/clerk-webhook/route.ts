import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const payload: WebhookEvent = await req.json();

    if (payload.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        payload.data;

      const fullName = [first_name, last_name].filter(Boolean).join(" ");

      await prisma.member.create({
        data: {
          userId: id,
          fullName: fullName || "Unnamed",
          avatarUrl: image_url,
          email: email_addresses[0].email_address,
        },
      });
    }

    if (payload.type === "user.deleted") {
      const { id } = payload.data;

      // Xoá Member liên kết với Clerk userId
      await prisma.member.delete({
        where: { userId: id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error handling Clerk webhook:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
