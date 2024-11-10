"use client";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Confetti, { ConfettiRef } from "@/components/ui/confetti";
import { CodeBlock, nord } from "react-code-blocks";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef } from "react";
import CopyButton from "@/components/copy-button";
import Link from "next/link";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { ArrowRightIcon } from "lucide-react";

function ClaimedPage() {
    const confettiRef = useRef<ConfettiRef>(null);
    const searchParams = useSearchParams();

    const key = searchParams.get("key");

    return (
        <>
            <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-30 size-full pointer-events-none"
            />
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <Link href={"https://discord.gg/mspaint"} target="_blank">
                    <div className="flex mb-2">
                    <div
                        className={cn(
                        "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                        )}
                    >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                        <DiscordLogoIcon className="mr-2" /><span>join mspaint discord</span>
                        <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                        </AnimatedShinyText>
                    </div>
                    </div>
                </Link>
                <Card className="max-w-[475px]">
                    <CardHeader>
                        <CardTitle>mspaint key purchase successful!</CardTitle>
                        <CardDescription>
                            Thank you for your support! without you we wouldn&apos;t be able to keep mspaint running.
                        </CardDescription>
                    </CardHeader>

                    <CardFooter className="flex flex-row gap-2">
                        <CodeBlock
							text={`getgenv().script_key="${key}"\nloadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()`}
							language={"lua"}
							showLineNumbers={false}
							theme={nord}
						/>

                        <CopyButton text={`getgenv().script_key="${key}"\nloadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()`} />
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default function WrapperClaimedPage() {
    return (
        <Suspense>
            <ClaimedPage />
        </Suspense>
    )
}