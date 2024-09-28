/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { cn } from "@/lib/utils";
import { IBM_Plex_Mono } from "next/font/google"
import { useEffect, useState, FC } from "react";
import z from "zod";

const mono = IBM_Plex_Mono({
    weight: ['200'],
    subsets: ['latin'],
    variable: '--font'
})

const themeSchema = z.object({
    FontColor: z.string(),
    MainColor: z.string(),
    AccentColor: z.string(),
    BackgroundColor: z.string(),
    OutlineColor: z.string(),
})

type theme = z.infer<typeof themeSchema>

function OptionsToggleScaffold({
    Side,
    Groupbox,
    CurrentActiveTab,
}: {
    Side?: string;
    Groupbox?: boolean;
    CurrentActiveTab?: any;
}) {
    const currentData = {
        Side: Side,
        Groupbox: Groupbox,
        CurrentActiveTab: CurrentActiveTab,
    }

    const scaffold = {
        Component: () => { return null; },
        AddToggle: (ID: string, data: {
            Text: string,
            Default: boolean | undefined,
            Tooltip: string | undefined,
            Callback: (value: boolean) => void | undefined,
        }) => {
            return null;
        },

    }

    const returnData = {currentData, ...scaffold}
    return returnData;
}

export default function LinoriaUI({
    Title,
    TabPadding,
    Show,
    onShowChange,
    Theme
}: {
    Title: string;
    TabPadding: number | undefined;
    Show?: boolean | undefined;
    onShowChange?: (show: boolean) => void | undefined;
    Theme?: string | undefined;
}) {
    const Linoria: {
        Component: FC<{ className?: string }>,
        AddTab: (title: string) => any,
        Tabs: any,
    } = {
      Component: () => { return null; },
      AddTab: () => { return null; },
      Tabs: {},
    };

    Linoria.Component = ({className}: {className?: string}) => {
        // Default Theme
        const [themeData, setThemeData] = useState<theme>({
            FontColor: "ffffff",
            MainColor: "1c1c1c",
            AccentColor: "0055ff",
            BackgroundColor: "141414",
            OutlineColor: "323232",
        });

        const [internalShow, setInternalShow] = useState(false)

        useEffect(() => {
            if (onShowChange == undefined) { return }

            if (Show == undefined) {
                setInternalShow(true)
                onShowChange(internalShow)
                return;
            }

            setInternalShow(Show)
            onShowChange(Show)
        }, [Show])

        useEffect(() => {
            if (Theme == undefined) { return }

            try {
                const parsedTheme = themeSchema.safeParse(JSON.parse(Theme))
                if (parsedTheme.success) {
                    setThemeData(parsedTheme.data)
                }
            } catch (error) {
                console.log("[LinoriaCard] Error parsing theme data:", error)
            }
        }, [Theme])

        return (
            <div className={cn(className, `${mono.className}`)}>
                <p>Hello world</p>
            </div>
        )
    }
    Linoria.Component.displayName = "LinoriaComponent";

    Linoria.AddTab = (title: string) => {
        Linoria.Tabs[title] = {
            Component: () => { return null; },
            Groupboxes: {},
            
            AddLeftGroupbox: (groupboxTitle: string) => {
                Linoria.Tabs[title].Groupboxes[groupboxTitle] = OptionsToggleScaffold({
                    Side: "Left",
                    Groupbox: true,
                });
            },

            AddRightGroupbox: (groupboxTitle: string) => {
                Linoria.Tabs[title].Groupboxes[groupboxTitle] = OptionsToggleScaffold({
                    Side: "Right",
                    Groupbox: true,
                });
            },

            AddLeftTabbox: (tabboxTitle: string) => {
                Linoria.Tabs[title].Groupboxes[tabboxTitle] = {
                    Side: "Left",
                    Groupbox: false,
                    CurrentActiveTab: undefined,
                    Tabs: {},

                    AddTab: (tabTitle: string) => {
                        Linoria.Tabs[title].Groupboxes[tabboxTitle].Tabs[tabTitle] = OptionsToggleScaffold({
                            Side: undefined,
                            Groupbox: false,
                            CurrentActiveTab: undefined,
                        });

                        if (Linoria.Tabs[title].Groupboxes[tabboxTitle].CurrentActiveTab == undefined) {
                            Linoria.Tabs[title].Groupboxes[tabboxTitle].CurrentActiveTab = tabTitle;
                        }
                    }
                }
            },

            AddRightTabbox: (tabboxTitle: string) => {
                Linoria.Tabs[title].Groupboxes[tabboxTitle] = {
                    Side: "Right",
                    Groupbox: false,
                    CurrentActiveTab: undefined,
                    Tabs: {},

                    AddTab: (tabTitle: string) => {
                        Linoria.Tabs[title].Groupboxes[tabboxTitle].Tabs[tabTitle] = OptionsToggleScaffold({
                            Side: undefined,
                            Groupbox: false,
                            CurrentActiveTab: undefined,
                        });

                        if (Linoria.Tabs[title].Groupboxes[tabboxTitle].CurrentActiveTab == undefined) {
                            Linoria.Tabs[title].Groupboxes[tabboxTitle].CurrentActiveTab = tabTitle;
                        }
                    }
                }
            },
            
        }

        return Linoria.Tabs[title];
    }

    return Linoria
}

/**
 * 
 * AddToggle: (UUID: string, data: {
                Text: string,
                Default: boolean | undefined,
                Tooltip: string | undefined,
                Callback: (value: boolean) => void | undefined,
            }) => {
                return null;
            },
 */