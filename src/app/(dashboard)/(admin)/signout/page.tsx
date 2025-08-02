import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button";

export default async function SignOutPage() {
    const session = await auth();

    return (
        <>
            <form action={async () => {
                "use server";
                await signOut();
            }}>
                <Button>Sign out</Button>
            </form>

            {session && session.user ? (
                <p>
                    Logged in as {session.user.name}
                </p>
            ) : <p>Not logged in</p>}
        </>
    )
}