import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth: any, req: NextRequest) => {
  // API routes handle their own auth, so just run clerkMiddleware for context
  if (isApiRoute(req)) {
    return; // Let API routes handle auth themselves
  }

  // Protect non-public routes (excluding API routes)
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files.
     * Note: API routes are included so Clerk can provide auth context,
     * but they handle their own authentication.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
