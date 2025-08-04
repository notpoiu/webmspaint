import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { sql } from "@vercel/postgres";
import { notFound } from "next/navigation";
import { RedeemComponent } from "./components/redeem";
import CopyButton from "@/components/copy-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { RESELLER_DATA } from "@/data/resellers";
import { ClientCodeBlock } from "@/components/codeblock";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { FileTextIcon } from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Metadata } from "next";

export async function generateMetadata(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const serial = searchParams?.serial;

  if (!searchParams || !serial) {
    return {
      title: "Not Found",
      description: "Unable to retrieve serial information",
    };
  }

  if (serial.split(",").length > 1) {
    return {
      title: "Bulk Purchase Completed",
      description:
        "Your mspaint bulk purchase has been completed successfully.",
    };
  }

  return {
    title: "Purchase Completed",
    description:
      "Thank you for your purchase! Your support helps us keep mspaint running.",
  };
}

function InvalidSearchParams() {
  return (
    <main className="flex justify-center items-center flex-col min-h-screen p-4">
      <Card className="max-w-[475px] w-full">
        <CardHeader>
          <CardTitle>mspaint key</CardTitle>
          <CardDescription>
            Sorry, we had a problem getting your serial. Please check if the URL
            has <span className="text-white">the serial query parameter</span>
            <br />
            <br />
            Example:{" "}
            <code className="break-all text-xs sm:text-sm">
              https://www.mspaint.cc/purchase/completed
              <span className="text-white">?serial=YOUR_SERIAL</span>
            </code>
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <Link href="/support">
            <Button size={"sm"}>Join Support Server</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

export default async function Page(props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  if (!searchParams) return notFound();

  const session = await auth();

  const serialParam = searchParams.serial;
  if (!serialParam) return InvalidSearchParams();

  const serials = serialParam.split(",");
  if (serials.length === 0) return InvalidSearchParams();

  // show claim stuff
  if (serials.length === 1) {
    const serial = serials[0];

    let { rows } =
      await sql`SELECT * FROM mspaint_keys_new WHERE serial = ${serial}`;

    if (rows.length === 0) {
      return (
        <main className="flex justify-center items-center flex-col min-h-screen p-4">
          <CrossCircledIcon className="h-24 w-24 sm:h-32 sm:w-32 text-red-500 mb-8" />
          <Card className="max-w-[475px] w-full">
            <CardHeader>
              <CardTitle>mspaint key</CardTitle>
              <CardDescription>
                Sorry, the mspaint serial{" "}
                <code className="text-white font-bold break-all text-xs sm:text-sm">
                  `{serial}`
                </code>{" "}
                does not exist in our database.
                <br />
                <br />
                Please check the link has the serial query parameter or contact
                your reseller or our support team.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/support">
                <Button size={"sm"}>Join Support Server</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      );
    }

    if (rows[0].claimed_at) {
      ({ rows } = await sql`
                SELECT *
                FROM public.mspaint_keys_new AS k
                JOIN public.mspaint_users AS u
                ON k.linked_to = u.discord_id WHERE k.serial = ${serial};`);

      const lrm_serial = rows[0].lrm_serial;

      if (
        session &&
        session.user &&
        rows[0].linked_to == session.user.id &&
        lrm_serial
      ) {
        return (
          <main className="flex justify-center items-center flex-col min-h-screen relative p-4">
            <FileTextIcon className="h-24 w-24 sm:h-32 sm:w-32 text-blue-500 mb-8" />
            <div className="relative z-10 w-full max-w-[475px]">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>mspaint script</CardTitle>
                  <CardDescription>
                    Thank you for your support! without you we wouldn&apos;t be
                    able to keep mspaint running.
                    <br />
                    <br />
                    You may also use the discord{" "}
                    <Link
                      href="https://discord.com/channels/1282361102935658777/1282373591652110417/1304067150171865131"
                      target="_blank"
                      className="text-blue-400 underline break-all"
                    >
                      script panel
                    </Link>{" "}
                    to get your script or to reset your HWID.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <RedeemComponent
                      serial={null}
                      username={session.user.name ?? "unknown"}
                      user_id={session.user.id || "skibidiSigma"}
                    />
                  </div>

                  <div className="flex flex-row gap-2 items-center w-full mt-5">
                    <ClientCodeBlock serial={lrm_serial} />
                  </div>

                  <Separator className="mt-2 mb-3" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col">
                      <p className="text-sm sm:text-base">
                        Logged in as {session.user.name}
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Not you? Sign out.
                      </p>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <Button
                        variant={"destructive"}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Sign Out
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs sm:text-sm mt-2 text-center px-4">
              <span className="text-muted-foreground">Order ID:</span>{" "}
              <span className="break-all">{rows[0].order_id}</span>
            </p>
          </main>
        );
      }

      return (
        <main className="flex justify-center items-center flex-col min-h-screen p-4">
          <ExclamationTriangleIcon className="h-24 w-24 sm:h-32 sm:w-32 text-yellow-500 mb-8" />

          <Card className="max-w-[475px] w-full">
            <CardHeader>
              <CardTitle className="flex justify-center text-center text-lg sm:text-xl">
                This mspaint key is already claimed.
              </CardTitle>
              <CardDescription className="text-sm">
                If you are the buyer of this key, you can Login with Discord
                using the button below to access the script or{" "}
                <Link
                  href="https://discord.com/channels/1282361102935658777/1282373591652110417/1304067150171865131"
                  target="_blank"
                  className="text-blue-400 underline break-all"
                >
                  use the script panel
                </Link>{" "}
                inside the{" "}
                <Link
                  href="https://discord.gg/mspaint"
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  Discord server
                </Link>
                .
                <br />
                <br />
                If you are the buyer but has not claimed this key, please create
                a ticket in the support server of your reseller (or ours).
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
              {(() => {
                const matchingResellers = Object.entries(RESELLER_DATA).filter(
                  ([key]) => rows[0].order_id?.toLowerCase().includes(key)
                );

                if (matchingResellers.length > 0) {
                  return (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"sm"} className="w-full">
                          Join Support Server
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link href="/support" className="w-full">
                            mspaint
                          </Link>
                        </DropdownMenuItem>
                        {matchingResellers.map(([key, data]) => (
                          <DropdownMenuItem key={key}>
                            <Link href={data.discord} className="w-full">
                              {data.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <form className="flex-1">
                      <ShimmerButton
                        borderRadius="50px"
                        shimmerColor="#5865F2"
                        shimmerSize="0.1em"
                        shimmerDuration="2.5s"
                        className="shadow-2xl w-full"
                        formAction={async () => {
                          "use server";
                          await signIn("discord");
                        }}
                      >
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white">
                          Login with Discord
                        </span>
                      </ShimmerButton>
                    </form>

                    <Link href="/support" className="flex-1">
                      <Button size={"sm"} className="w-full">
                        Join Support Server
                      </Button>
                    </Link>
                  </div>
                );
              })()}
            </CardFooter>
          </Card>
        </main>
      );
    }

    const keyDuration = rows[0].key_duration;

    return (
      <main className="flex justify-center items-center flex-col min-h-screen relative p-4">
        <CheckCircledIcon className="h-24 w-24 sm:h-32 sm:w-32 text-green-500 mb-8 z-10" />

        <div className="relative z-10 w-full max-w-[475px]">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-center text-center text-lg sm:text-xl">
                Your mspaint key is valid!
              </CardTitle>
              {session && session.user ? null : (
                <div className="flex justify-center">
                  <p className="text-foreground text-center text-sm">
                    Log in below to get your key.
                  </p>
                </div>
              )}
              <CardDescription className="text-sm">
                Thank you for your support! Only share this link if you are
                gifting the key to someone else{" "}
                <Link
                  href={"/privacy"}
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  (Privacy Policy)
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session && session.user ? (
                <>
                  <div className="flex justify-center">
                    <RedeemComponent
                      serial={serial}
                      username={session.user.name ?? "unknown"}
                      user_id={session.user.id || "skibidiSigma"}
                    />
                  </div>
                  <p className="text-foreground text-center text-sm mt-4">
                    Key duration: {keyDuration ?? "Lifetime"}
                  </p>
                  <Separator className="mt-2 mb-3" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col">
                      <p className="text-sm sm:text-base">
                        Logged in as {session.user.name}
                      </p>

                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Not you? Sign out.
                      </p>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <Button
                        variant={"destructive"}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Sign Out
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <form
                    action={async () => {
                      "use server";
                      await signIn("discord");
                    }}
                    className="w-full"
                  >
                    <ShimmerButton
                      borderRadius="50px"
                      shimmerColor="#5865F2"
                      shimmerSize="0.1em"
                      shimmerDuration="2.5s"
                      className="shadow-2xl w-full"
                    >
                      <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white">
                        Login with Discord
                      </span>
                    </ShimmerButton>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <p className="text-xs sm:text-sm mt-2 text-center px-4">
          <span className="text-muted-foreground">Order ID:</span>{" "}
          <span className="break-all">{rows[0].order_id}</span>
        </p>
      </main>
    );
  } else {
    return (
      <main className="flex justify-center items-center flex-col min-h-screen p-4">
        <CheckCircledIcon className="h-24 w-24 sm:h-32 sm:w-32 text-green-500 mb-8" />
        <Card className="max-w-[475px] w-full">
          <CardHeader>
            <CardTitle className="flex justify-center text-center text-lg sm:text-xl">
              mspaint bulk keys purchase successful!
            </CardTitle>
            <CardDescription className="text-sm">
              You have purchased multiple mspaint serials, to redeem them open
              the links below:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col mt-2 gap-2">
              {serials.map((serial) => (
                <div
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                  key={serial}
                >
                  <Input
                    readOnly
                    className="text-xs sm:text-sm"
                    value={
                      process.env.NODE_ENV === "development"
                        ? `http://localhost:3000/purchase/completed?serial=${serial}`
                        : `https://www.mspaint.cc/purchase/completed?serial=${serial}`
                    }
                  />
                  <CopyButton
                    text={
                      process.env.NODE_ENV === "development"
                        ? `http://localhost:3000/purchase/completed?serial=${serial}`
                        : `https://www.mspaint.cc/purchase/completed?serial=${serial}`
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }
}
