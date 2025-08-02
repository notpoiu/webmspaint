import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { auth, signIn } from "@/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();

  if (session && session.user) {
    return redirect("/subscription-dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center black-500 p-4">
      <Card className="w-full max-w-md overflow-hidden shadow-xl">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src="/mspaint.png" // mspaint logo
              alt="mspaint Pro"
              fill
              className="object-cover"
              quality={100}
            />
          </div>
          <div className="p-2">
            <CardTitle className="text-3xl font-bold text-center text-white-700">
              Dashboard
            </CardTitle>
            <CardDescription className="mt-2 text-center text-muted-foreground">
              Manage your mspaint account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="mt-2">
            <form
              action={async () => {
                "use server";

                await signIn("discord");
              }}
            >
              <ShimmerButton
                borderRadius="50px"
                shimmerColor="#5865F2"
                shimmerSize="0.1em"
                shimmerDuration="2.5s"
                className="w-full shadow-2xl"
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white">
                  Login with Discord
                </span>
              </ShimmerButton>
            </form>
          </div>

          <p className="mt-6 text-muted-foreground text-xs text-center">
            By signing in, you agree to our{" "}
            <Link
              href={"/tos"}
              target="_blank"
              className="text-blue-400 underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href={"/privacy"}
              target="_blank"
              className="text-blue-400 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
