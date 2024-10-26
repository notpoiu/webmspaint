"use client";

import DotPattern from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation"

export default function Page() {
    const router = useRouter();

    return (
        <main className="relative container">
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] -z-50",
                )}
            />

            <div className="flex items-center justify-center w-full h-[calc(100vh-50px)]">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>mspaint Key System</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button className="mr-2" onClick={() => { router.push("https://ads.luarmor.net/get_key?for=mspaint_key-rXJfopyAkrky") }}>Linkvertise <Image className="ml-2" src="/icons/linkvertise.png" width={25} height={25} alt="Linkvertise" /></Button>
                        <Button className="" onClick={() => { router.push("https://ads.luarmor.net/get_key?for=mspaint_key_lootlabs-nKrOEVsfKDGQ") }}>Lootlabs <Image className="ml-2" src="/icons/lootlabs.png" width={30} height={30} alt="Lootlabs" /></Button>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}