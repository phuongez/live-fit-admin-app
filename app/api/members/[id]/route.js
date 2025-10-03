// api/members/[id]/route.js

import { PrismaClient } from "../../../../generated/prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, context) {
  const { id } = await context.params; // ✅ unwrap params
  const member = await prisma.member.findUnique({ where: { userId: id } });
  return NextResponse.json(member);
}

export async function PATCH(req, context) {
  const { id } = await context.params; // ✅ unwrap params
  const body = await req.json();

  const updated = await prisma.member.update({
    where: { userId: id },
    data: body,
  });

  return NextResponse.json(updated);
}
