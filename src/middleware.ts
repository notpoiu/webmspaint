export { auth as middleware } from "@/auth"

export const config = {
    matcher: ['/purchase/completed/:path*', '/dashboard/:path*', '/signin', '/signout']
}