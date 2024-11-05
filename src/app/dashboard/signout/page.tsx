import { signOut } from "@/auth"
import { Button } from "@/components/ui/button";

export default async function SignOutPage() {
    return (
        <form action={async () => {
            "use server";
            await signOut();
        }}>
            <Button>Sign out</Button>
        </form>
    )
}