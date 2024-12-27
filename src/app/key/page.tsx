"use client";

import BlurFade from "@/components/magicui/blur-fade";
import DotPattern from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <main className="overflow-x-hidden">
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

            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="flex items-center justify-center">
                    <BlurFade delay={0.2 + (1 * 0.05)} inView>
                        <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>mspaint Key System</CardTitle>
                            </CardHeader>
                            <CardFooter className="flex justify-center">
                                <Link href={"https://ads.luarmor.net/get_key?for=mspaint_key-rXJfopyAkrky"}>
                                    <Button className="mr-2">Linkvertise <Image className="ml-2" src="/icons/linkvertise.png" width={25} height={25} alt="Linkvertise" /></Button>
                                </Link>

                                <Link href={"https://ads.luarmor.net/get_key?for=mspaint_workink_key-kbDcHryVSREv"}>
                                    <Button className="mr-2">work.ink <Image className="ml-2" src="/icons/workink.png" width={25} height={25} alt="work.ink" /></Button>
                                </Link>

                                {/*<Link href={""}>
                                    <Button className="text-muted-foreground cursor-not-allowed" variant={"ghost"}>Lootlabs <Image className="ml-2" src="/icons/lootlabs.png" width={25} height={25} alt="Lootlabs" /></Button>
                                </Link>*/}
                            </CardFooter>
                        </Card>
                    </BlurFade>
                </div>
            </div>
        </main>
    );
}