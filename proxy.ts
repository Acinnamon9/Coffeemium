import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/demo(.*)",
  "/shop(.*)",
  "/products(.*)",
  "/origins(.*)",
  "/cart(.*)",
  "/login(.*)",
  "/register(.*)",
  "/api/products(.*)",
]);
const isIgnoredRoute = createRouteMatcher(["/api/webhook(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isIgnoredRoute(req)) return;

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
