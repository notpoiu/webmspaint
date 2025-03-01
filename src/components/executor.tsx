import Image from "next/image";
import Link from "next/link";
import BlurFade from "./magicui/blur-fade";
import { cn } from "@/lib/utils";

export default function Executor({ url, name, image, isWidth }: { url: string, name: string, image: string, isWidth?: boolean }) {
    return (
    <Link href={url} target="_blank">
        <BlurFade delay={0.2 + (3 * 0.05)} className="flex flex-row items-center justify-center gap-1 max-md:gap-3" inView>
            <Image alt="" src={image} width={isWidth == true ? 80 : 30} height={30} className={cn(`max-md:w-${isWidth == true ? "18" : "14"} max-md:h-14`)} />
            <span className="text-lg font-bold max-md:text-3xl">{name}</span>
        </BlurFade>
    </Link>);
}