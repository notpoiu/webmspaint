import { auth } from "@/auth";
import { notFound } from "next/navigation";

const admin_userids = ["1177722124035706931", "389792019360514048", "773212482835710032", "1098248637789786165"];

export default async function Page() {
    const session = await auth();

    if (!session || !session.user) {
        return notFound();
    }
    console.log(session.user.id);
    if (!admin_userids.includes(session.user.id ?? "1")) {
        return notFound();
    }

    return (
        <main>
            <p>welcome to my skibidi dashboard :content:</p>
        </main>
    )
}