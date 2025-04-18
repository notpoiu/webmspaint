import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sql } from "@vercel/postgres";
import { notFound } from "next/navigation";
import { RedeemComponent } from "./components/redeem";
import CopyButton from "@/components/copy-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function Page(
    props: {
        searchParams?: Promise<{ [key: string]: string | undefined }>;
    }
) {
    const searchParams = await props.searchParams;
    if (!searchParams) return notFound();
    const session = await auth();

    // no serial = 404
    const serialParam = searchParams.serial;
    if (!serialParam) return notFound();
    
    const serials = serialParam.split(",");
    if (serials.length === 0) return notFound();

    // show claim stuff
    if (serials.length === 1) {
        const serial = serials[0];
        const { rows } = await sql`SELECT * FROM mspaint_keys WHERE serial = ${serial}`;
    
        // already claimed
        if (rows.length === 0 || rows[0].claimed === true) {
            return (
                <main className="flex justify-center items-center flex-col h-screen">
                    <Card className="max-w-[475px]">
                        <CardHeader>
                            <CardTitle>mspaint key</CardTitle>
                            <CardDescription>
                                This key is already claimed. If you are the buyer of this key, <Link href="https://discord.com/channels/1282361102935658777/1282373591652110417/1304067150171865131" target="_blank" className="text-blue-400 underline">use the script panel</Link> inside the <Link href="https://discord.gg/mspaint" target="_blank" className="text-blue-400 underline">Discord server</Link>.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </main>
            )
        }
    
        return (
            <main className="flex justify-center items-center flex-col h-screen">
                <Card className="max-w-[475px]">
                    <CardHeader>
                        <CardTitle>mspaint key purchase successful!</CardTitle>
                        <CardDescription>
                            Thank you for your support! Only share this link if you are gifting the key to someone else <Link href={"/privacy"} target="_blank" className="text-blue-400 underline">(Privacy Policy)</Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {session && session.user ? (
                            <>
                                <div className="flex justify-center">
                                    <RedeemComponent serial={serial} username={session.user.name ?? "unknown"} user_id={session.user.id || "skibidiSigma"} />
                                </div>
    
    
                                <Separator className="mt-5 mb-5" />
                                <div className="flex items-center justify-between">                                
                                    <div className="flex flex-col">
                                        <p>
                                            Logged in as {session.user.name}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Not you? Sign out.
                                        </p>
                                    </div>
                                    <form action={async () => {
                                        "use server"
                                        await signOut();
                                    }}>
                                        <Button variant={"destructive"}>
                                            Sign Out
                                        </Button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <>
                                <form action={async () => {
                                    "use server"
                                    await signIn("discord");
                                }}>
                                    <Button>
                                        Login with Discord
                                    </Button>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>
                <p className="text-sm mt-2">
                    <span className="text-muted-foreground">Order ID:</span> {rows[0].order_id}
                </p>
            </main>
        )
    } else {
        return (
            <main className="flex justify-center items-center flex-col h-screen">
                <Card className="max-w-[475px]">
                    <CardHeader>
                        <CardTitle>mspaint bulk keys purchase successful!</CardTitle>
                        <CardDescription>
                            You have purchased multiple mspaint serials, to redeem them open the links below:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col mt-2 gap-2">
                            {serials.map((serial) => (
                                <div className="flex flex-row items-center gap-2" key={serial}>
                                    <Input readOnly value={process.env.NODE_ENV === "development" ? `http://localhost:3000/purchase/completed?serial=${serial}` : `https://www.mspaint.cc/purchase/completed?serial=${serial}`}/>
                                    <CopyButton text={process.env.NODE_ENV === "development" ? `http://localhost:3000/purchase/completed?serial=${serial}` : `https://www.mspaint.cc/purchase/completed?serial=${serial}`} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        )
    }
}