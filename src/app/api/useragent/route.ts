import { NextRequest, userAgent } from "next/server";

export async function GET(request: NextRequest) {
    const { ua } = userAgent(request);
    return new Response(ua, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8"
        }
    });
}