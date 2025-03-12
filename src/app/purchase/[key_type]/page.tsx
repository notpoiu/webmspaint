import { redirect } from "next/navigation"

const products = {
    "lifetime": "https://shop.mspaint.cc/product/mspaint-lifetime-key?store=mspaint&quantity=1&data=faq"
}

export default async function Page(props: { params: Promise<{ key_type: string }> }) {
    const params = await props.params;
    let redirectURI = "/shop";
    if (params.key_type in products) redirectURI = products[params.key_type as keyof typeof products] as string;

    return redirect(redirectURI);
}