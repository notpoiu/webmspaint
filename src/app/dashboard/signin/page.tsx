import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function SignInPage() {
    return (
        <form action={async () => {
            "use server";
            await signIn("discord");
        }}>
            <Button>Sign in lil bro :content:</Button>
        </form>
    )
}