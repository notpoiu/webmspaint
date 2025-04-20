import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("signature");
  const secret = process.env.SELLAPP_WEBHOOK_SECRET ?? "sigma";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (hash === signature) {
    const data = JSON.parse(payload);

    return new Response(`testing: ${JSON.stringify(data, null, 2)}`);

    /*const serialsFormatted = createdSerials
            .map(serial => `https://www.mspaint.cc/purchase/completed?serial=${encodeURIComponent(serial)}`)
            .join(" | ");

        return new Response(
            `Thank you for purchasing ${data.quantity} mspaint key(s)!\n` +
            `You can redeem your serial(s) at: ${serialsFormatted}\n\n` +
            `Make sure to keep this link safe, as it is the only way to redeem your key(s).`
        );*/
  } else {
    return new Response("Invalid signature");
  }
}
