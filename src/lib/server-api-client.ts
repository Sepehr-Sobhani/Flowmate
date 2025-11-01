import "server-only";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Helper function to get auth headers for server-side requests
export async function getServerAuthHeaders(): Promise<Record<string, string>> {
  const { userId } = await auth();

  if (!userId) {
    return {};
  }

  const dbUser = await prisma.user.findFirst({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    return {};
  }

  return {
    "x-user-id": dbUser.id,
  };
}
