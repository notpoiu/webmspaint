import { redirect } from "next/navigation"

const products = {
    "lifetime": "https://mspaint.sell.app/product/mspaint-lifetime-key?store=mspaint&quantity=1&data=faq"
}

export default function Page({ params }: { params: { key_type: string } }) {
    let redirectURI = "/shop";
    if (params.key_type in products) redirectURI = products[params.key_type as keyof typeof products] as string;
    
    return redirect(redirectURI);
}