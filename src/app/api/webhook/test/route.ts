import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log("webhook sillyware :DDD");
    console.log(JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
}