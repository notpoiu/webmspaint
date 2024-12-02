import { NextRequest, userAgent } from "next/server";

export async function GET(request: NextRequest) {
    const { ua } = userAgent(request);
    return Response.json({ "user-agent": ua });
}