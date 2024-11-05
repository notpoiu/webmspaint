import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function SignInPage() {
    const session = await auth();

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
        </>
    )
}