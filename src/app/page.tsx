import { BlurFade } from "@/components/magicui/blur-fade";
import DotPattern from "@/components/magicui/dot-pattern";
import NumberTicker from "@/components/magicui/number-ticker";
import Safari from "@/components/magicui/safari";
import ReviewMarquee from "@/components/reviews";
import { MacbookComponent } from "@/components/ui/macbook";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import Image from "next/image";
import Iphone15Pro from "@/components/magicui/iphone-15-pro";
import WordRotate from "@/components/ui/word-rotate";
import WordFadeIn from "@/components/ui/word-fade-in";
import GameCard from "@/components/game-card";
import { Highlighter } from "@/components/magicui/highlighter";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import CopyButton from "@/components/copy-button";
import { ShinyButton } from "@/components/magicui/shiny-button";
import Executor from "@/components/executor";
import { Features } from "@/components/features";
import DynamicShopButton from "@/components/buy-mspaint";
import { gamesList } from "@/data/games";
import { auth } from "@/auth";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity";
import { UIStateProvider } from "@/components/obsidian/uiState";

export default async function Home() {
  const session = await auth();
  const noAccount = !session || !session.user || !session.user.id;

  // discord
  let gamesStatusData, languageData, guildData;
  try {
    const guildResponse = await fetch(
      "https://discord.com/api/v9/invites/mspaint?with_counts=true&with_expiration=true",
      { cache: "force-cache", next: { revalidate: 300 } }
    ); // 5 minutes
    guildData = await guildResponse.json();
  } catch {
    guildData = { approximate_member_count: 20000 };
  }

  // languages
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/mspaint-cc/translations/refs/heads/main/Languages.json",
      { cache: "force-cache", next: { revalidate: 300 } }
    ); // 5 minutes
    languageData = await response.json();
  } catch {
    languageData = { ["en"]: {} };
  }

  // games data
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/mspaint-cc/assets/refs/heads/main/status.json",
      { cache: "force-cache", next: { revalidate: 60 } }
    ); // 1 minute
    gamesStatusData = await response.json();
  } catch {
    gamesStatusData = {};
  }

  return (
    <>
      <Navbar className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <NavbarBrand>
          <Image
            className="mr-2"
            alt="mspaint"
            src="/icon.png"
            width={25}
            height={25}
          />
          <p className="font-bold text-inherit">mspaint</p>
        </NavbarBrand>

        <NavbarContent justify="end" className="mt-4 mb-4">
          <NavbarItem>
            <Link
              href="https://shop.mspaint.cc/"
              className="relative text-foreground transition-colors hover:text-neutral-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Shop
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href={noAccount ? "/sign-in" : "/subscription-dashboard"}
              className="relative text-foreground transition-colors hover:text-neutral-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {noAccount ? "Sign In" : "Dashboard"}
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="overflow-x-hidden group">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] -z-50",
            "group-aria-hidden:hidden"
          )}
        />

        <div className="overflow-hidden w-full">
          <MacbookComponent
            title={
              <div className="flex flex-col items-center justify-center">
                <BlurFade delay={0.2 + 1 * 0.05}>
                  <Link href={"https://shop.mspaint.cc/"} target="_blank">
                    <div className="flex mb-2">
                      <div
                        className={cn(
                          "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        )}
                      >
                        <DynamicShopButton />
                      </div>
                    </div>
                  </Link>
                </BlurFade>

                <BlurFade delay={0.2 + 2 * 0.05}>
                  <h1 className="text-6xl font-bold text-center">mspaint</h1>
                </BlurFade>

                <BlurFade delay={0.2 + 3 * 0.05}>
                  <div className="text-2xl flex flex-row justify-center items-center  gap-2">
                    <span className="font-bold">The best</span>{" "}
                    <WordRotate duration={2500} words={gamesList} /> script
                  </div>
                </BlurFade>

                <BlurFade delay={0.2 + 4 * 0.05}>
                  <div className="flex flex-row items-center justify-center mt-2 gap-2">
                    <Input
                      type="text"
                      className="overflow-hidden text-ellipsis min-w-[300px]"
                      readOnly
                      value={
                        'loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()'
                      }
                    />
                    <CopyButton
                      text={
                        'loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()'
                      }
                    />

                    <Link
                      aria-label="Discord Server"
                      href={"https://discord.gg/mspaint"}
                      target="_blank"
                    >
                      <ShinyButton className="px-2" aria-label="Discord Server">
                        <svg
                          className="w-5 h-5"
                          id="svg"
                          viewBox="0 0 48 37"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M40.6606 3.08587C37.5127 1.62534 34.1825 0.587574 30.7579 0C30.3314 0.764729 29.833 1.79329 29.4893 2.61157C25.7971 2.06103 22.1387 2.06103 18.5144 2.61157C18.1709 1.79348 17.6612 0.764729 17.2307 0C13.8029 0.587845 10.4698 1.62826 7.32043 3.0935C1.05343 12.4846 -0.645507 21.6422 0.203868 30.6702C4.36056 33.7483 8.38881 35.6182 12.3492 36.8418C13.3334 35.4996 14.2035 34.0786 14.9504 32.5935C13.5284 32.0567 12.1576 31.3951 10.8542 30.6167C11.1972 30.3646 11.5322 30.1018 11.8585 29.8289C19.7564 33.4921 28.3379 33.4921 36.1416 29.8289C36.4694 30.1 36.8042 30.3627 37.1457 30.6167C35.8402 31.3971 34.4669 32.06 33.0421 32.5974C33.7932 34.0885 34.6617 35.5109 35.6432 36.8455C39.6074 35.6221 43.6394 33.7522 47.7961 30.6702C48.7928 20.2046 46.0936 11.1309 40.6606 3.08569V3.08587ZM16.0264 25.1182C13.6555 25.1182 11.7111 22.9233 11.7111 20.2505C11.7111 17.5778 13.6141 15.3792 16.0264 15.3792C18.439 15.3792 20.3832 17.5739 20.3417 20.2505C20.3455 22.9233 18.439 25.1182 16.0264 25.1182ZM31.9735 25.1182C29.6026 25.1182 27.6584 22.9233 27.6584 20.2505C27.6584 17.5778 29.5611 15.3792 31.9735 15.3792C34.3861 15.3792 36.3302 17.5739 36.2888 20.2505C36.2888 22.9233 34.3861 25.1182 31.9735 25.1182Z"
                            fill="#5865F2"
                          />
                        </svg>
                      </ShinyButton>
                    </Link>
                  </div>
                </BlurFade>
              </div>
            }
            src={`https://ob4fgkbb3w.ufs.sh/f/q5sBExIITNsABaQo4HAKU9TJFX7q3z8ExZVAWyQeLOfamDgu`}
            outro={
              <div
                key={1}
                className="flex flex-col items-center justify-center max-md:mb-[10rem]"
              >
                <BlurFade delay={0.2 + 1 * 0.05} inView>
                  <h1 className="text-2xl font-bold mt-[5rem] text-center px-5">
                    Supporting your favorite executors
                  </h1>
                </BlurFade>

                <div className="flex flex-row items-center justify-center mt-5 gap-8 max-md:flex-col">
                  <Executor
                    name={"Zenith"}
                    image={
                      "https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsT3nEx1yJXhEGA6wmQvc0jSk7ZrMVC3nTg5i9"
                    }
                    url={"https://zenith.win"}
                  />
                  <Executor
                    name={"Seliware"}
                    image={
                      "https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsfZjhFPc93HZnPaFmTiUcpydAzsQLVK54BWrO"
                    }
                    url={"https://seliware.com"}
                  />
                  <Executor
                    name={"Nucleus"}
                    image={
                      "https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAs5ImRVrMxTny6kRILmGKFZcwpAtJ8zEgP1fNh"
                    }
                    url={"https://nucleus.rip"}
                  />
                  <Executor
                    name={"Solara"}
                    image={
                      "https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsKTjfEJrg4CbGHLXhvIFxQV5pY6qirBw2Ju7n"
                    }
                    url={"https://getsolara.dev"}
                  />
                  <Executor
                    name={"Delta"}
                    image={
                      "https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAslPmgsgFtT6a830HkYDKeuAh9RwMGsqd24CQZ"
                    }
                    url={"https://deltaexploits.gg"}
                  />
                </div>

                <BlurFade delay={0.2 + 7 * 0.05} inView>
                  <h4 className="text-muted-foreground text-sm mt-5">
                    And many more...
                  </h4>
                </BlurFade>
              </div>
            }
            showGradient={true}
          />
        </div>

        <div
          id="games"
          className="flex flex-col items-center mt-[-15vh] mb-[10vh] text-center overflow-hidden relative"
        >
          <WordFadeIn
            className="text-3xl md:text-3xl"
            words={`mspaint officially supports ${
              Object.keys(gamesList).length
            } games`}
            inView
          />
          <BlurFade className="mb-[15px]" delay={0.2 + 1 * 0.05} inView>
            <WordFadeIn
              className="text-xl md:text-xl font-normal"
              words={`quality & quantity`}
              inView
              initialDelay={0.15 * 6}
              delay={0.35}
            />
          </BlurFade>

          <BlurFade
            className="flex flex-row items-center justify-center mt-5 gap-3 max-md:flex-col flex-wrap px-10"
            delay={0.2 + 2 * 0.05}
            inView
          >
            <GameCard
              title={"DOORS"}
              id={6516141723}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsJ2hyPErBlZ5kfsQT24O8oeiR73u9rdc6zgm1`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Dead Rails"}
              id={116495829188952}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAs9AEEhFodlyrJ6uEv40SUmQtNBXAzhP87IaKM`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Forsaken"}
              id={18687417158}
              image={`https://ob4fgkbb3w.ufs.sh/f/q5sBExIITNsABgYQjlAKU9TJFX7q3z8ExZVAWyQeLOfamDgu`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Fisch"}
              id={16732694052}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsncwz3g7ulbhtMx156dQV3GozKUs08gOmX9jv`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Grow A Garden"}
              id={126884695634066}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsHV5ApBayj1tLCfgrzV73ZonhEDeNGAiRdxQ0`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Bubble Gum Simulator Infinity"}
              id={85896571713843}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsKDiSPErg4CbGHLXhvIFxQV5pY6qirBw2Ju7n`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Pressure"}
              id={12411473842}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsH0LmZ6Layj1tLCfgrzV73ZonhEDeNGAiRdxQ`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"3008"}
              id={2768379856}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsw0tQCS53yIYB4kajObRWsGN6r8uJDg2QVmKc`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Rooms & Doors"}
              id={5865058321}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsbnS21bRQaNIsxXOcZmM8nAt4WkiC0HGreJvP`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Build A Boat For Treasure"}
              id={537413528}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAs98wtNJodlyrJ6uEv40SUmQtNBXAzhP87IaKM`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Grace"}
              id={138837502355157}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAs57LO68MxTny6kRILmGKFZcwpAtJ8zEgP1fNh`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Murder Mystery 2"}
              id={142823291}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsBsdLSiOKJxivCc6LDnOGta3RYUHkWNMdS51o`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Word Bomb"}
              id={2653064683}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAsJ2uVLQbBlZ5kfsQT24O8oeiR73u9rdc6zgm1`}
              gamesStatusData={gamesStatusData}
            />

            <GameCard
              title={"Notoriety"}
              id={21532277}
              image={`https://q2p0njok3b.ufs.sh/f/Z155p1jPvLAskzKaZ1yN8Yh20HbLkz1KupR6QJWqIBGA9FOj`}
              gamesStatusData={gamesStatusData}
            />
          </BlurFade>
        </div>

        <UIStateProvider>
          <Features />
        </UIStateProvider>

        <div className="flex flex-col items-center text-center py-28">
          <WordFadeIn
            className="text-3xl md:text-3xl"
            words={`mspaint is translated in ${
              Object.keys(languageData).length - 1
            } languages`}
            inView
          />
          <BlurFade delay={0.2 + 1 * 0.05} inView>
            <WordFadeIn
              className="text-xl md:text-xl font-normal"
              words={`accessibility done right`}
              inView
              initialDelay={0.15 * 6}
              delay={0.25}
            />
          </BlurFade>

          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-10 mb-10">
            <ScrollVelocityContainer className="text-base">
              {(() => {
                const labels: string[] = [];
                const data = languageData || {};
                Object.keys(data).forEach((code) => {
                  const entry = data[code];
                  if (!entry) return;
                  if (
                    code === "zh" &&
                    typeof entry === "object" &&
                    !("NativeName" in entry)
                  ) {
                    Object.keys(entry).forEach((variant) => {
                      if (variant.toLowerCase() === "default") return;
                      const v = entry[variant as keyof typeof entry] as {
                        NativeName: string;
                        EnglishName: string;
                      };

                      if (v && (v.NativeName || v.EnglishName)) {
                        labels.push(v.NativeName || v.EnglishName);
                      }
                    });
                    return;
                  }
                  if (entry.NativeName || entry.EnglishName) {
                    labels.push(entry.NativeName || entry.EnglishName);
                  }
                });
                // ensure English appears if desired, currently excluded by design
                // labels.unshift("English");

                const mid = Math.ceil(labels.length / 2);
                const first = labels.slice(0, mid);
                const second = labels.slice(mid);
                const Chip = ({ label }: { label: string }) => (
                  <span className="mx-2 my-1 px-3 py-1 whitespace-nowrap">
                    {label}
                  </span>
                );
                return (
                  <>
                    <ScrollVelocityRow baseVelocity={5} direction={1}>
                      {first.map((l) => (
                        <Chip key={`lang-top-${l}`} label={l} />
                      ))}
                    </ScrollVelocityRow>
                    {second.length > 0 && (
                      <ScrollVelocityRow baseVelocity={5} direction={-1}>
                        {second.map((l) => (
                          <Chip key={`lang-bottom-${l}`} label={l} />
                        ))}
                      </ScrollVelocityRow>
                    )}
                  </>
                );
              })()}
            </ScrollVelocityContainer>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
          </div>

          <Separator className="mt-[2.5rem] w-[55vw]" />
        </div>

        <div className="flex flex-col items-center justify-center px-2 text-center">
          <BlurFade delay={0.2 + 1 * 0.05} className="mb-5" inView>
            <h1 className="text-3xl font-bold text-center flex flex-col">
              <span>
                Used by{" "}
                <span className="font-bold">
                  over{" "}
                  <NumberTicker value={guildData.approximate_member_count} />+
                  people
                </span>
              </span>
              <span className="text-muted-foreground text-lg">
                And even by{" "}
                <span className="font-bold text-white">Kardin Hong</span>
              </span>
            </h1>
          </BlurFade>
          <BlurFade delay={0.2 + 1.5 * 0.05} inView>
            <div className="max-md:hidden block">
              <div className="relative w-[90vw] flex justify-center items-center">
                <Safari
                  url="youtube.com"
                  className=""
                  src="https://utfs.io/f/q5sBExIITNsAy07ylyEodEnluv6LfbZ04sCwrmkiRPq19FWQ"
                />
              </div>
            </div>

            <div className="max-md:block hidden">
              <div className="relative w-[90vw] flex justify-center items-center">
                <Iphone15Pro
                  src={
                    "https://utfs.io/f/q5sBExIITNsAPkWgUY54JfWXEC7kbxjzUtwqByLTpnOSZdmY"
                  }
                />
              </div>
            </div>
          </BlurFade>

          <Separator className="mt-[2.5rem] w-[55vw]" />

          <h1 id="reviews" className="text-2xl mt-[2.5rem] text-center">
            Here&apos;s what people say about{" "}
            <Highlighter action="underline" color="#FF9800" isView>
              mspaint
            </Highlighter>
          </h1>

          <Suspense fallback={<div>Loading...</div>}>
            <ReviewMarquee />
          </Suspense>

          <h1 className="text-2xl font-bold  mt-[2.5rem] text-center">FAQ</h1>
          <p className="text-muted-foreground">
            The full FAQ is in the{" "}
            <Link
              target="_blank"
              className="text-white-500 underline"
              href={"https://discord.gg/mspaint"}
            >
              Discord Server
            </Link>
          </p>

          <Accordion
            id="faq"
            type="single"
            collapsible
            className="max-w-[1000px] w-[50vw] max-md:w-[75vw]"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I get whitelisted?</AccordionTrigger>
              <AccordionContent>
                You can get whitelisted by purchasing a key from the{" "}
                <Link
                  className="text-white-500 underline"
                  href={"https://shop.mspaint.cc/"}
                >
                  shop
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                Where can I report bugs and suggest features?
              </AccordionTrigger>
              <AccordionContent>
                You can report bugs and suggest features in the Discord server.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Does this work on mobile?</AccordionTrigger>
              <AccordionContent>Yes. mspaint works on mobile.</AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                I can&apos;t close the GUI. How can I fix it?
              </AccordionTrigger>
              <AccordionContent>
                Close out of the GUI by pressing the shift on the right side of
                your keyboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What games are supported?</AccordionTrigger>
              <AccordionContent>
                As of right now,{" "}
                {gamesList.slice(0, -1).join(", ") +
                  " and " +
                  gamesList.slice(-1)}{" "}
                are supported.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>How do I review the script?</AccordionTrigger>
              <AccordionContent>
                You can review the script by using the{" "}
                <span className="bg-blue-400/70 px-1 py-[0.5px] rounded-sm font-bold">
                  /review
                </span>{" "}
                command in the discord server.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="mt-[5rem] w-screen" />

          <div className="px-10 py-6 w-screen flex flex-row justify-between items-center max-md:justify-center max-md:flex-col">
            <div className="px-2 py-2 flex flex-row items-center gap-2">
              <Image alt="mspaint" src="/icon.png" width={25} height={25} />
              <div>
                <p className="text-xs text-left">mspaint</p>
                <p className="text-muted-foreground text-xs">
                  Site made by upio
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-xs px-2 py-2 text-right max-md:text-center max-md:mt-5">
              This software is not affiliated, associated, authorized, endorsed
              by, or
              <br />
              in any way officially connected with Roblox or Microsoft or any of
              its subsidiaries or its affiliates.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
