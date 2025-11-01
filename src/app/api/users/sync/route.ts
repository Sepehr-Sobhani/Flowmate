import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, username, fullName, avatarUrl } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find or create user in your database
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { clerkId: userId }],
      },
    });

    if (dbUser) {
      // Update existing user
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          clerkId: userId,
          email,
          username: username || dbUser.username,
          fullName: fullName || dbUser.fullName,
          avatarUrl: avatarUrl || dbUser.avatarUrl,
          lastLogin: new Date(),
          isVerified: true,
        },
      });
    } else {
      // Create new user
      const baseUsername =
        username || email.split("@")[0] + "_" + Date.now().toString().slice(-6);

      // Ensure username is unique
      let uniqueUsername = baseUsername;
      let counter = 1;
      while (
        await prisma.user.findUnique({
          where: { username: uniqueUsername },
        })
      ) {
        uniqueUsername = `${baseUsername}_${counter}`;
        counter++;
      }

      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
          username: uniqueUsername,
          fullName: fullName,
          avatarUrl: avatarUrl,
          isVerified: true,
          lastLogin: new Date(),
        },
      });
    }

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      fullName: dbUser.fullName,
      avatarUrl: dbUser.avatarUrl,
      isActive: dbUser.isActive,
      isVerified: dbUser.isVerified,
      createdAt: dbUser.createdAt.toISOString(),
      updatedAt: dbUser.updatedAt.toISOString(),
      lastLogin: dbUser.lastLogin?.toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    const statusCode =
      error instanceof Error && error.message.includes("Unauthorized")
        ? 401
        : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
