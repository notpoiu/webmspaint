//export { auth as middleware } from "@/auth"

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    await auth();

    const requestHeaders = new Headers(request.headers);

    const ip = request.ip || "";
    
    requestHeaders.set("x-mspaint-ip", ip);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}