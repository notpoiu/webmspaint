import CopyButton from "@/components/copy-button";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import BlurFade from "@/components/magicui/blur-fade";
import DotPattern from "@/components/magicui/dot-pattern";
import NumberTicker from "@/components/magicui/number-ticker";
import Safari from "@/components/magicui/safari";
import ReviewMarquee from "@/components/reviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MacbookComponent } from "@/components/ui/macbook";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image";
import Iphone15Pro from "@/components/magicui/iphone-15-pro";
import WordRotate from "@/components/ui/word-rotate";
import WordFadeIn from "@/components/ui/word-fade-in";
import { Globe } from "@/components/ui/globe";
import { ShoppingBagIcon } from "lucide-react";
import { Highlight } from "@/components/ui/hero-highlight";
import { Suspense } from "react";

export default async function Home() {
  const response = await fetch("https://raw.githubusercontent.com/mspaint-cc/translations/refs/heads/main/Languages.json", {
    next: { revalidate: 20 }
  });
  const languageData = await response.json();

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

      <div className="overflow-hidden w-full">
        <MacbookComponent
          title={
            <div className="flex flex-col items-center justify-center">
              <BlurFade delay={0.2 + (1 * 0.05)}>
                <Link href={"https://shop.mspaint.cc/"} target="_blank">
                  <div className="flex mb-2">
                    <div
                      className={cn(
                        "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                      )}
                    >
                      <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                        <ShoppingBagIcon className="mr-2" /><span>Buy mspaint lifetime</span>
                        <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                      </AnimatedShinyText>
                    </div>
                  </div>
                </Link>
              </BlurFade>

              <BlurFade delay={0.2 + (2 * 0.05)}>
                <h1 className="text-6xl font-bold text-center">
                  mspaint
                </h1>
              </BlurFade>
              <BlurFade delay={0.2 + (3 * 0.05)}>
                <div className="text-2xl flex flex-row justify-center items-center  gap-2">
                  <span className="font-bold">The best</span>{" "}
                  <WordRotate
                    duration={1250}
                    words={[
                      "DOORS",
                      "3008",
                      "R&D",
                      "Pressure",
                      "Fisch",
                      "BABFT",
                      "Grace",
                      "MM2"
                    ]}
                  />{" "} script
                </div>
              </BlurFade>
              
              <BlurFade delay={0.2 + (4 * 0.05)}>
                <div className="flex flex-row items-center justify-center mt-2 gap-2">
                  <Input className="overflow-hidden text-ellipsis min-w-[300px]" readOnly value={'loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()'}/>
                  <CopyButton text={'https://docs.upio.dev/mspaint/key-system'} />
                  <Link href={"https://discord.gg/mspaint"} target="_blank">
                    <Button size={"icon"} variant={"outline"} className="px-2">
                      <svg className="w-5 h-5" id="svg" viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40.6606 3.08587C37.5127 1.62534 34.1825 0.587574 30.7579 0C30.3314 0.764729 29.833 1.79329 29.4893 2.61157C25.7971 2.06103 22.1387 2.06103 18.5144 2.61157C18.1709 1.79348 17.6612 0.764729 17.2307 0C13.8029 0.587845 10.4698 1.62826 7.32043 3.0935C1.05343 12.4846 -0.645507 21.6422 0.203868 30.6702C4.36056 33.7483 8.38881 35.6182 12.3492 36.8418C13.3334 35.4996 14.2035 34.0786 14.9504 32.5935C13.5284 32.0567 12.1576 31.3951 10.8542 30.6167C11.1972 30.3646 11.5322 30.1018 11.8585 29.8289C19.7564 33.4921 28.3379 33.4921 36.1416 29.8289C36.4694 30.1 36.8042 30.3627 37.1457 30.6167C35.8402 31.3971 34.4669 32.06 33.0421 32.5974C33.7932 34.0885 34.6617 35.5109 35.6432 36.8455C39.6074 35.6221 43.6394 33.7522 47.7961 30.6702C48.7928 20.2046 46.0936 11.1309 40.6606 3.08569V3.08587ZM16.0264 25.1182C13.6555 25.1182 11.7111 22.9233 11.7111 20.2505C11.7111 17.5778 13.6141 15.3792 16.0264 15.3792C18.439 15.3792 20.3832 17.5739 20.3417 20.2505C20.3455 22.9233 18.439 25.1182 16.0264 25.1182ZM31.9735 25.1182C29.6026 25.1182 27.6584 22.9233 27.6584 20.2505C27.6584 17.5778 29.5611 15.3792 31.9735 15.3792C34.3861 15.3792 36.3302 17.5739 36.2888 20.2505C36.2888 22.9233 34.3861 25.1182 31.9735 25.1182Z" fill="#5865F2"></path></svg>
                    </Button>
                  </Link>
                </div>
              </BlurFade>
            </div>
          }
          src={`https://utfs.io/f/q5sBExIITNsAwzYsgE6Jd1Yu7jHXAosWPV5MnxqUgtz2BNCK`}
          outro={
            <>
              <BlurFade delay={0.2 + (1 * 0.05)} inView>
                <h1 className="text-2xl font-bold mt-[5rem] text-center px-5">
                  Supporting your favorite executors
                </h1>
              </BlurFade>
              <div className="flex flex-row items-center justify-center mt-5 gap-10 max-md:flex-col">
                <Link href={"https://getsolara.dev/"} target="_blank">
                  <BlurFade delay={0.2 + (2 * 0.05)} className="flex flex-row items-center justify-center gap-1 max-md:gap-3"  inView>
                    <Image alt="solara" src="/executors/solara.png" width={35} height={35} className="max-md:w-14 max-md:h-14" />
                    <span className="text-lg font-bold max-md:text-3xl">Solara</span>
                  </BlurFade>
                </Link>
                <Link href={"https://getwave.gg/"} target="_blank">
                  <BlurFade delay={0.2 + (3 * 0.05)} className="flex flex-row items-center justify-center gap-1 max-md:gap-3"  inView>
                    <Image alt="wave" src="/executors/wave.ico" width={30} height={30} className="max-md:w-14 max-md:h-14" />
                    <span className="text-lg font-bold max-md:text-3xl">Wave</span>
                  </BlurFade>
                </Link>
                <Link href={"https://synapsez.net/"} target="_blank">
                  <BlurFade delay={0.2 + (4 * 0.05)} className="flex flex-row items-center justify-center gap-1 max-md:gap-3"  inView>
                    <Image alt="synapse z" src="/executors/synz.ico" width={30} height={30} className="max-md:w-14 max-md:h-14" />
                    <span className="text-lg font-bold max-md:text-3xl">Synapse Z</span>
                  </BlurFade>
                </Link>
                <Link href={"https://www.abyssdigital.xyz/"} target="_blank">
                  <BlurFade delay={0.2 + (5 * 0.05)} className="flex flex-row items-center justify-center gap-1 max-md:gap-3"  inView>
                    <Image alt="macsploit" src="/executors/macsploit.png" width={30} height={30} className="max-md:w-14 max-md:h-14" />
                    <span className="text-lg font-bold max-md:text-3xl">Macsploit</span>
                  </BlurFade>
                </Link>
                <Link href={"https://seliware.com/"} target="_blank">
                  <BlurFade delay={0.2 + (6 * 0.05)} className="flex flex-row items-center justify-center gap-1 max-md:gap-3"  inView>
                    <Image alt="codex" src="/executors/seliware.png" width={30} height={30} className="max-md:w-20 max-md:h-12" />
                    <span className="text-lg font-bold max-md:text-3xl">Seliware</span>
                  </BlurFade>
                </Link>
              </div>
              <BlurFade delay={0.2 + (7 * 0.05)}  inView>
                  <h4 className="text-muted-foreground text-sm mt-5">And many more...</h4>
              </BlurFade>
            </>
          }
          showGradient={true}
        />
      </div>
      
      <div className="flex flex-col items-center mb-[25vh] text-center overflow-hidden max-h-[30rem] relative">
        <WordFadeIn className="text-3xl md:text-3xl" words={`mspaint is translated in ${Object.keys(languageData).length - 1} languages`} inView />
        <BlurFade delay={0.2 + (1 * 0.05)} inView>
          <WordFadeIn className="text-xl md:text-xl font-normal" words={`accesability done right.`} inView initialDelay={0.15 * 6} delay={0.25} />
        </BlurFade>
        <BlurFade delay={0.2 + (2 * 0.05)} inView>
          <Globe speed={0.45} />
        </BlurFade>
        <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-[#0a0a0a] via-black to-transparent w-full pointer-events-none" />
      </div>

      <div className="flex flex-col items-center justify-center px-2 text-center">
        <BlurFade delay={0.2 + (1 * 0.05)} className="mb-5" inView>
          <h1 className="text-3xl font-bold text-center flex flex-col">
            <span>Used by <span className="font-bold">over{" "}
              <NumberTicker value={10000} />
              + people
            </span></span>
            <span className="text-muted-foreground text-lg">And even by <span className="font-bold text-white">Kardin Hong</span></span>
          </h1>
        </BlurFade>
        <BlurFade delay={0.2 + (1.5 * 0.05)} inView>
          <div className="max-md:hidden block">
            <div className="relative w-[90vw] flex justify-center items-center">
              <Safari url="youtube.com" className="" src="https://utfs.io/f/q5sBExIITNsAy07ylyEodEnluv6LfbZ04sCwrmkiRPq19FWQ" />
            </div>
          </div>

          <div className="max-md:block hidden">
            <div className="relative w-[90vw] flex justify-center items-center">
              <Iphone15Pro src={"https://utfs.io/f/q5sBExIITNsAPkWgUY54JfWXEC7kbxjzUtwqByLTpnOSZdmY"} />
            </div>
          </div>
        </BlurFade>

        <Separator className="mt-[2.5rem] w-[55vw]" />

        <h1 className="text-2xl mt-[2.5rem] text-center">
          Here&apos;s what people say about <Highlight className="font-bold" inView animationSpeed={1.5}>mspaint</Highlight>
        </h1>

        <Suspense fallback={<div>Loading...</div>}>
          <ReviewMarquee />
        </Suspense>
        
        <h1 className="text-2xl font-bold  mt-[2.5rem] text-center">
          FAQ
        </h1>
        <p className="text-muted-foreground">The full FAQ is in Discord</p>

        <Accordion type="single" collapsible className="max-w-[1000px] w-[50vw] max-md:w-[75vw]">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do i do the keysystem?</AccordionTrigger>
            <AccordionContent>
              Tutorial on how to use the Key System is here: <Link href={"https://docs.upio.dev/mspaint/key-system"} target="_blank" className="text-blue-300 underline">https://docs.upio.dev/mspaint/key-system</Link>.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Where can I report bugs and suggest features?</AccordionTrigger>
            <AccordionContent>
              You can report bugs and suggest features on the Discord server or in the GitHub repository.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Does it work on mobile?</AccordionTrigger>
            <AccordionContent>
              Yes. mspaint works on mobile.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How do i use it?</AccordionTrigger>
            <AccordionContent>
              Download an executor such as <Link href={"https://getsolara.dev"} target="_blank" className="text-blue-300 underline">Solara</Link> and execute the script.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>I can&apos;t close the GUI?</AccordionTrigger>
            <AccordionContent>
              Close out of the GUI by pressing the shift on the right side of your keyboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>What games are supported?</AccordionTrigger>
            <AccordionContent>
              As of right now, DOORS, 3008, Rooms & Doors, Pressure, Fisch, BABFT, Grace and Murder Mystery 2 are supported.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Separator className="mt-[5rem] w-screen" />

        <div className="px-10 py-6 w-screen flex flex-row justify-between items-center max-md:justify-center max-md:flex-col">
          <div className="px-2 py-2 flex flex-row items-center gap-2">
            <Image alt="mspaint" src="/icon.png" width={25} height={25} />
            <div>
              <p className="text-xs text-left">mspaint</p>
              <p className="text-muted-foreground text-xs">Site made by upio</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs px-2 py-2 text-right max-md:text-center max-md:mt-5">
            This software is not affiliated, associated, authorized, endorsed by, or<br />
            in any way officially connected with Roblox or Microsoft
            or any of its subsidiaries or its affiliates.</p>
        </div>
      </div>
    </main>
  );
}
