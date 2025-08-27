"use client";
import { ChevronsUpDown } from "lucide-react";
import WordFadeIn from "./ui/word-fade-in";
import { BlurFade } from "./magicui/blur-fade";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LatestBuild, MenuMapping } from "../../features.config";

import { Obsidian } from "./obsidian/obsidian";
import { set } from "zod";
import { useResetUIState } from "./obsidian/uiState";

/**
 * Renders a searchable popover allowing the user to pick a game and reports the selection.
 *
 * The list is populated from MenuMapping and grouped by category. Selecting an item closes the popover,
 * updates the component's visible label, and invokes the provided callback with the selection in the
 * "Category - Game" format.
 *
 * @param onValueChange - Callback invoked when the user selects a game. Receives a single string in the exact format "Category - Game".
 */
export function GameSelection({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("DOORS - The Hotel");

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
                  {Object.keys(
                    MenuMapping[name as keyof typeof MenuMapping]
                  ).map((game, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => {
                        setOpen(false);
                        setValue(`${name} - ${game}`);
                        onValueChange(`${name} - ${game}`);
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
  );
}

/**
 * Renders the features UI for a selected game and manages loading and refreshing of per-game UI data.
 *
 * On mount this component loads UI data for the initial game and, when the user selects a different
 * game via GameSelection, fetches that game's DataURL JSON, updates the Obsidian panel's uiData and
 * footer, and triggers a UI reset using useResetUIState.
 *
 * The component composes the Obsidian panel (title, icon, footer) with the fetched `uiData`, shows
 * a GameSelection control, and keeps local state for the current game and footer label.
 *
 * @returns A React element displaying the features panel and game selector.
 */
export function Features() {
  const [game, setGame] = React.useState("DOORS - The Hotel");
  const [footerGame, setFooterGame] = React.useState("DOORS");
  const [uiData, setUIData] = React.useState(undefined);

  const refresh = useResetUIState();

  const memoizedObsidian = React.useMemo(() => {
    return (
      <Obsidian
        title={"mspaint v4"}
        icon={"/icon.png"}
        footer={`Game: ${footerGame} | Build: ${LatestBuild}`}
        uiData={uiData}
      />
    );
  }, [uiData, footerGame]);

  React.useEffect(() => {
    const category = game.split(" - ")[0] as keyof typeof MenuMapping;
    const gameName = game.split(" - ")[1];
    const gameData =
      MenuMapping[category][
        gameName as keyof (typeof MenuMapping)[typeof category]
      ];

    setGame(game);

    const dataURL = (gameData as { DataURL: string }).DataURL;
    if (!dataURL) return;

    fetch(dataURL)
      .then((res) => res.json())
      .then((data) => {
        setUIData(data);
        // @ts-expect-error erm
        setFooterGame(gameData.Game);
        refresh();
      });
  }, []);

  return (
    <div
      id="features"
      className="flex flex-col items-center text-center py-28 z-10"
    >
      <WordFadeIn
        className="text-3xl md:text-3xl mb-5"
        words={`mspaint features:`}
        inView
      />

      <BlurFade inViewMargin="0px" inView>
        <div className="max-w-[720px] max-h-[600px] scale-[0.8] max-sm:scale-[0.5] md:scale-90 lg:scale-100">
          {memoizedObsidian}
        </div>

        <GameSelection
          onValueChange={(game) => {
            const category = game.split(" - ")[0] as keyof typeof MenuMapping;
            const gameName = game.split(" - ")[1];
            const gameData =
              MenuMapping[category][
                gameName as keyof (typeof MenuMapping)[typeof category]
              ];

            setGame(game);

            const dataURL = (gameData as { DataURL: string }).DataURL;
            if (!dataURL) return;

            fetch(dataURL)
              .then((res) => res.json())
              .then((data) => {
                setUIData(data);
                // @ts-expect-error erm
                setFooterGame(gameData.Game);
                refresh();
              });
          }}
        />
      </BlurFade>
    </div>
  );
}
