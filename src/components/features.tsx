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
import { useResetUIState } from "./obsidian/uiState";

export function GameSelection({
	onValueChange,
}: {
	onValueChange: (value: string) => void;
}) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("DOORS - The Hotel");
	
	const [search, setSearch] = React.useState("");
	const filteredGroups = React.useMemo(() => {
		const searchLc = search.toLowerCase();
		const categories = Object.keys(MenuMapping) as Array<keyof typeof MenuMapping>;

		return categories.map((catKey) => {
			const category = String(catKey);
			const allGames = Object.keys(MenuMapping[catKey]) as Array<keyof (typeof MenuMapping)[typeof catKey]>;
			
			const games = allGames.filter((gk) => {
				const gameKey = String(gk);
				const gameData = MenuMapping[catKey][gk] as { Game?: string };

				return (
					gameKey.toLowerCase().includes(searchLc) ||
					(gameData.Game?.toLowerCase().includes(searchLc))
				);
			}) as string[];

			return { category, games };
		}).filter((g) => g.games.length > 0);
	}, [search]);

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
					<CommandInput
						placeholder="Search a game..."
						className="h-9"
						value={search}
						onValueChange={(val) => setSearch(val)}
					/>
					<CommandList>
						{filteredGroups.length > 0 ? (
							filteredGroups.map(({ category, games }) => (
								<CommandGroup heading={category} key={category}>
									{games.map((gameKey) => (
										<CommandItem
											key={gameKey}
											onSelect={() => {
												const fullValue = `${category} - ${gameKey}`;
												setValue(fullValue);
												onValueChange(fullValue);
												setOpen(false);
												setSearch("");
											}}
										>
											{gameKey}
										</CommandItem>
									))}
								</CommandGroup>
							))
						) : (
							<CommandEmpty>No game found.</CommandEmpty>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

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
		const gameName = game.split(" - ")[1] as keyof (typeof MenuMapping)[typeof category];
		const gameData = MenuMapping[category][gameName];

		setGame((g) => g);

		const dataURL = (gameData as { DataURL: string }).DataURL;
		if (!dataURL) return;

		fetch(dataURL)
			.then((res) => res.json())
			.then((data) => {
				setUIData(data);
				setFooterGame((gameData as { Game: string }).Game);
				refresh();
			});
	}, [game, refresh]);

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

						fetch(dataURL).then((res) => res.json()).then((data) => {
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