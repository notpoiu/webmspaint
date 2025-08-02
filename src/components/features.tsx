"use client";
import { ChevronsUpDown } from "lucide-react";
import { Obsidian } from "./obsidian/obsidian";
import WordFadeIn from "./ui/word-fade-in";
import { BlurFade } from "./magicui/blur-fade";

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { LatestBuild, MenuMapping } from "../../features.config";

import type { JSX } from "react";

export function GameSelection({ onValueChange }: { onValueChange: (value: string) => void }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("DOORS - The Hotel")

    const displayText = () => {
        if (value.includes(" - ")) {
            const [category, game] = value.split(" - ");
            if (category === game) {
                return category;
            }
        }
        return value || "Select a game";
    };
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between mt-5 mb-5 max-md:mt-2 max-md:mb-2 max-sm:mb-1 max-sm:mt-1"
                >
                    {displayText()}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search a game..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No game found.</CommandEmpty>
                        <CommandGroup>
                        {Object.keys(MenuMapping).map((name, index) => (
                            <CommandGroup heading={name} key={index}>
                                {Object.keys(MenuMapping[name as keyof typeof MenuMapping]).map((game, index) => (
                                    <CommandItem
                                        key={index}
                                        onSelect={() => {
                                            setOpen(false)
                                            setValue(`${name} - ${game}`)
                                            onValueChange(`${name} - ${game}`)
                                        }}
                                    >
                                        {game}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export function Features() {
    const [game, setGame] = React.useState("DOORS - The Hotel");
    const [footerGame, setFooterGame] = React.useState("DOORS");
    const [tabs, setTabs] = React.useState<{
        title: string;
        icon: React.ComponentType;
        tabContent: JSX.Element;
    }[]>(MenuMapping["DOORS"]["The Hotel"]["Tabs"]);

    const memoizedObsidian = React.useMemo(() => (
        <Obsidian
            title={"mspaint v4"}
            icon={"/icon.png"}
            footer={`Game: ${footerGame} | Build: ${LatestBuild}`}
            tabs={tabs}
        />
    ), [footerGame, tabs]);

    return (
        <div id="features" className="flex flex-col items-center text-center py-28 z-10">
            <WordFadeIn className="text-3xl md:text-3xl mb-5" words={`mspaint features:`} inView />

            <BlurFade inViewMargin="0px" inView>
                <div className="max-w-[720px] max-h-[600px] scale-[0.8] max-sm:scale-[0.5] md:scale-90 lg:scale-100">
                    {memoizedObsidian}
                </div>

                <GameSelection onValueChange={(game) => {
                    const category = game.split(" - ")[0] as keyof typeof MenuMapping;
                    const gameName = game.split(" - ")[1];
                    const gameData = MenuMapping[category][gameName as keyof typeof MenuMapping[typeof category]];

                    setGame(game);

                    // @ts-expect-error erm
                    setFooterGame(gameData.Game);
                    // @ts-expect-error erm
                    setTabs(gameData.Tabs);
                }} />
                <p className="hidden" key={game}>bruh</p>
            </BlurFade>
        </div>
    )
}