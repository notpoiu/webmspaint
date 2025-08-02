import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { isUserAllowedOnDashboard } from "@/server/authutils";
import Link from "next/link";

export default async function SignInPage() {
    const session = await auth();

    const allowed = await isUserAllowedOnDashboard();

    return (
        <>
            <form action={async () => {
                "use server";
                await signIn("discord");
            }}>
                <Button>Sign in lil bro :content:</Button>
            </form>

            {session && session.user ? (
                <p>
                    Logged in as {session.user.name}
                </p>
            ) : <p>Not logged in</p>}

            {allowed && <Link href="/dashboard">Go to dashboard</Link>}
        </>
    )
}