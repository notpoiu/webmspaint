export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/((?!icons|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
