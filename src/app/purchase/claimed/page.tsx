"use client";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Confetti, { ConfettiRef } from "@/components/ui/confetti";
import { CodeBlock, nord } from "react-code-blocks";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import CopyButton from "@/components/copy-button";

export default function ClaimedPage() {
    const confettiRef = useRef<ConfettiRef>(null);
    const searchParams = useSearchParams();

    const key = searchParams.get("key");

    return (
        <>
            <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-30 size-full pointer-events-none"
            />
            <div className="w-full h-screen flex justify-center items-center">
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