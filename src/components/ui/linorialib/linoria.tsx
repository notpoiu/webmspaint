/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { cn } from "@/lib/utils";
import { IBM_Plex_Mono } from "next/font/google"
import { useEffect, useState, FC } from "react";
import z from "zod";
import { LinoriaTabButton } from "./components/linoriatab";
import { LinoriaGroupBox } from "./components/linoriagroupbox";
import { LinoriaToggle } from "./components/linoriatoggle";

const mono = IBM_Plex_Mono({
    weight: ['400'],
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

export type theme = z.infer<typeof themeSchema>

interface LinoriaTabInterface {
    AddLeftGroupbox: (groupboxTitle: string) => LinoriaGroupboxInterface,
    AddRightGroupbox: (groupboxTitle: string) => LinoriaGroupboxInterface,
    AddLeftTabbox: (tabboxTitle: string) => LinoriaGroupboxInterface,
    AddRightTabbox: (tabboxTitle: string) => LinoriaGroupboxInterface,
    Groupboxes: {
        [key: string]: LinoriaGroupboxInterface
    },
    Component: FC<{ className?: string }>,
}

interface GenericElementInterface {
    Text: string,
    Default: any | undefined,
    Tooltip: string | undefined,
    SubElements?: ColorPickerInterface | KeyboardInterface
}

type ToggleInterface = GenericElementInterface & {
    Type: "Toggle",
    Callback: (value: boolean) => void | undefined,
}

type ButtonInterface = GenericElementInterface & {
    Type: "Button",
    DoubleClick?: boolean,
    Callback: () => void | undefined,
}

type SliderInterface = GenericElementInterface & {
    Type: "Slider",
    Default: number,
    Min: number,
    Max: number,
    Suffix?: string,
    Rounding: number,
    Compact?: boolean,
    HideMax?: boolean,
}

type DropdownInterface = GenericElementInterface & {
    Type: "Dropdown",
    Default: number,
    Options: string[],
    Tooltip?: string,
    Multi?: boolean,
    Callback: (value: string) => void | undefined,
}

type TextInputInterface = GenericElementInterface & {
    Type: "TextInput",
    Numeric?: boolean,
    Finished?: boolean,
    ClearTextOnFocus?: boolean,
    Text?: string,
    Tooltip?: string,
    Placeholder?: string,
    MaxLength?: number,
}

type ColorPickerInterface = GenericElementInterface & {
    Type: "ColorPicker",
    Default: [number, number, number],
    Title?: string,
    Transparency?: number,
    Callback: (value: string) => void | undefined,
}

type KeyboardInterface = GenericElementInterface & {
    Type: "Keyboard",
    Default: string,
    SyncToggleState?: boolean,
    Mode: "Always" | "Toggle" | "Hold"
    NoUI?: boolean,
}

type DividerInterface = GenericElementInterface & {
    Type: "Divider",
}

type LabelInterface = GenericElementInterface & {
    Type: "Label"
}

interface LinoriaGroupboxInterface {
    Side: "Left" | "Right",
    Groupbox: boolean,
    CurrentActiveTab?: string | undefined,
    Tabs?: {
        [key: string]: {
            Side: string | undefined,
            Groupbox: boolean,
            CurrentActiveTab: string | undefined,
        }
    },
    Elements: {
        [key: string]: ToggleInterface | ButtonInterface | SliderInterface | DropdownInterface | TextInputInterface | LabelInterface | DividerInterface,
    },
    AddToggle: (ID: string, data: {
        Text: string,
        Default: boolean | undefined,
        Tooltip: string | undefined,
        Callback: (value: boolean) => void | undefined,
    }) => void,
    AddTab?: (title: string) => void,
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
        Component: FC<{ className?: string, componentHeight?: number }>,
        AddTab: (title: string) => LinoriaTabInterface,
        Tabs: {
            [key: string]: LinoriaTabInterface
        },
    } = {
      Component: () => { return null; },
      AddTab: (title: string) => { return {
        AddLeftGroupbox: (groupboxTitle: string) => {
          return {
            Side: "Left",
            Groupbox: true,
            CurrentActiveTab: undefined,
            Elements: {},
            Component: () => { return null; },
            AddToggle: () => { return null; },
          };
        },
        AddRightGroupbox: (groupboxTitle: string) => {
          return {
            Side: "Right",
            Groupbox: true,
            CurrentActiveTab: undefined,
            Elements: {},
            Component: () => { return null; },
            AddToggle: () => { return null; },
          };
        },
        AddLeftTabbox: (tabboxTitle: string) => {
          return {
            Side: "Left",
            Groupbox: false,
            CurrentActiveTab: undefined,
            Tabs: {},
            Elements: {},
            Component: () => { return null; },
            AddToggle: () => { return null; },
            AddTab: () => { return null; },
          };
        },
        AddRightTabbox: (tabboxTitle: string) => {
          return {
            Side: "Right",
            Groupbox: false,
            CurrentActiveTab: undefined,
            Tabs: {},
            Elements: {},
            Component: () => { return null; },
            AddToggle: () => { return null; },
            AddTab: () => { return null; },
          };
        },
        Groupboxes: {},
        Component: () => { return null; },
      }; },
      Tabs: {},
    };

    const OptionsToggleScaffold =({
        Side,
        Groupbox,
        CurrentActiveTab,
    }: {
        Side?: string;
        Groupbox?: boolean;
        CurrentActiveTab?: any;
    }) => {
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
    

    Linoria.AddTab = (title: string) => {
        Linoria.Tabs[title] = {
            Component: () => { return null; },
            Groupboxes: {},
            
            AddLeftGroupbox: (groupboxTitle: string) => {
                Linoria.Tabs[title].Groupboxes[groupboxTitle] = {
                    ...OptionsToggleScaffold({
                        Side: "Left",
                        Groupbox: true,
                    }),
                    Side: "Left",
                    Groupbox: true,
                    Elements: {},
                };

                return Linoria.Tabs[title].Groupboxes[groupboxTitle];
            },

            AddRightGroupbox: (groupboxTitle: string) => {
                Linoria.Tabs[title].Groupboxes[groupboxTitle] = {
                    ...OptionsToggleScaffold({
                        Side: "Right",
                        Groupbox: true,
                    }),
                    Side: "Right",
                    Groupbox: true,
                    Elements: {},
                };

                return Linoria.Tabs[title].Groupboxes[groupboxTitle];
            },

            AddLeftTabbox: (tabboxTitle: string) => {
                Linoria.Tabs[title].Groupboxes[tabboxTitle] = {
                    Component: () => { return null; },
                    AddToggle: () => { return null; },
                    Side: "Left",
                    Groupbox: false,
                    CurrentActiveTab: undefined,
                    Tabs: {},
                    Elements: {},

                    AddTab: (tabTitle: string) => {
                        if (!Linoria.Tabs[title].Groupboxes[tabboxTitle].Tabs) {
                            Linoria.Tabs[title].Groupboxes[tabboxTitle].Tabs = {};
                        }

                        Linoria.Tabs[title].Groupboxes[tabboxTitle].Tabs[tabTitle] = {
                            ...OptionsToggleScaffold({
                                Side: undefined,
                                Groupbox: false,
                                CurrentActiveTab: undefined,
                            }),
                            Side: undefined,
                            Groupbox: false,
                            CurrentActiveTab: undefined,
                        };

                        if (Linoria.Tabs[title].Groupboxes[tabboxTitle].CurrentActiveTab == undefined) {
                            Linoria.Tabs[title].Groupboxes[tabboxTitle].CurrentActiveTab = tabTitle;
                        }
                    }
                }

                return Linoria.Tabs[title].Groupboxes[tabboxTitle];
            },

            AddRightTabbox: (tabboxTitle: string) => {
                Linoria.Tabs[title].Groupboxes[tabboxTitle] = {
                    Component: () => { return null; },
                    AddToggle: () => { return null; },
                    Side: "Right",
                    Groupbox: false,
                    CurrentActiveTab: undefined,
                    Tabs: {},
                    Elements: {},

                    AddTab: (tabTitle: string) => {
                        if (!Linoria.Tabs[title].Groupboxes[tabboxTitle].Tabs) {
                            Linoria.Tabs[title].Groupboxes[tabboxTitle].Tabs = {};
                        }

                        Linoria.Tabs[title].Groupboxes[tabboxTitle].Tabs[tabTitle] = {
                            ...OptionsToggleScaffold({
                                Side: undefined,
                                Groupbox: false,
                                CurrentActiveTab: undefined,
                            }),
                            Side: undefined,
                            Groupbox: false,
                            CurrentActiveTab: undefined,
                        };

                        if (Linoria.Tabs[title].Groupboxes[tabboxTitle].CurrentActiveTab == undefined) {
                            Linoria.Tabs[title].Groupboxes[tabboxTitle].CurrentActiveTab = tabTitle;
                        }
                    }
                }

                return Linoria.Tabs[title].Groupboxes[tabboxTitle];
            },
            
        }

        return Linoria.Tabs[title];
    }


    Linoria.Component = ({className, componentHeight}: {className?: string, componentHeight?: number}) => {
        // Default Theme
        const [themeData, setThemeData] = useState<theme>({
            FontColor: "ffffff",
            MainColor: "1c1c1c",
            AccentColor: "0055ff",
            BackgroundColor: "141414",
            OutlineColor: "323232",
        });

        const [internalShow, setInternalShow] = useState(false)
        const [internalCurrentActiveTab, setInternalCurrentActiveTab] = useState<string | undefined>(undefined)

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
            <div className={cn(className, `${mono.className} border-[2px] min-h-[${componentHeight ?? 275}px] text-[12.5px] border-[#000000]`)}>
                <div 
                    className={`border-[1.5px] min-h-[${componentHeight ?? 275}px]`}
                    style={{ 
                        background: "#" + themeData.MainColor, 
                        borderColor: "#" + themeData.AccentColor
                    }}
                >
                    <p className="ml-[5px]" style={{
                        color: "#" + themeData.FontColor
                    }}>{Title}</p>

                    <div className={`ml-[7px] mr-[7px] mb-[7px] border-[2px] min-h-[${componentHeight ?? 275}px]`} style={{ 
                        borderColor: "#" + themeData.BackgroundColor
                    }}>
                        <div className={`border-[1.5px] min-h-[${componentHeight ?? 275}px]`} style={{ 
                            background: "#" + themeData.BackgroundColor,
                            borderColor: "#000000"
                        }}>
                            <div className={`ml-[5px] mr-[5px] mt-[5px] mb-[5px] border-[2px] min-h-[${componentHeight ?? 275}px]`} style={{ 
                                borderColor: "#" + themeData.BackgroundColor
                            }}>
                                <div className={`min-h-[${componentHeight ?? 275}px]`}
                                    style={{
                                        border: "2px solid #" + themeData.OutlineColor,
                                        background: "#" + themeData.BackgroundColor
                                    }}
                                >
                                    {/* Tabs */}
                                    <div className={cn("flex flex-row relative")} style={{
                                        borderBottom: "2px solid #" + themeData.OutlineColor,
                                        background: "#"  + themeData.BackgroundColor
                                    }}>
                                        {Object.entries(Linoria.Tabs).map(([key, value], index) => {
                                            if (internalCurrentActiveTab == undefined && index == 0) {
                                                setInternalCurrentActiveTab(key)
                                            }

                                            return <LinoriaTabButton TabPadding={TabPadding ?? 0} key={index} data={themeData} onClick={() => {
                                                setInternalCurrentActiveTab(key)
                                            }} name={key} active={key === internalCurrentActiveTab} index={index} />
                                        })}
                                    </div>
                                    
                                    <div className={`flex flex-row w-full min-h-[${componentHeight ?? 275}px]`}>
                                        {/* Left Groupbox */}
                                        <div className={`min-h-[${(componentHeight)}px] w-1/2`} style={{ background: "#" + themeData.MainColor }}>
                                            {/* GroupBox */}
                                            <div className={"flex"}>
                                                {
                                                    Object.entries(Linoria.Tabs[internalCurrentActiveTab ?? "Main"].Groupboxes).map(([key, value], index) => {
                                                        if (value.Side == "Left") {
                                                            if (value.Groupbox == true) {
                                                                return (
                                                                    <LinoriaGroupBox key={index} data={themeData} first={index == 0} name={key}>
                                                                        {Object.entries(value.Elements).map(([key, value], index) => {
                                                                            if (value.Type == "Toggle") {
                                                                                return (
                                                                                    <LinoriaToggle key={index} data={themeData} onClick={() => {
                                                                                        setInternalCurrentActiveTab(key)
                                                                                    }} name={key} active={key === internalCurrentActiveTab} index={index} />
                                                                                )
                                                                            }
                                                                        })}
                                                                    </LinoriaGroupBox>
                                                                )
                                                            }
                                                        }
                                                        
                                                    })
                                                }
                                            </div>
                                        </div>
                                        
                                        {/* Rihgt Groupbox */}
                                        <div className={`min-h-[${(componentHeight)}px] w-1/2`} style={{ background: "#" + themeData.MainColor }}>
                                            <div className={"flex"}>
                                                {
                                                    Object.entries(Linoria.Tabs[internalCurrentActiveTab ?? "Main"].Groupboxes).map(([key, value], index) => {
                                                        if (value.Side == "Right") {
                                                            if (value.Groupbox == true) {
                                                                return (
                                                                    <LinoriaGroupBox key={index} data={themeData} first={index == 0} name={key}>
                                                                        <p>hi</p>
                                                                    </LinoriaGroupBox>
                                                                )
                                                            }
                                                        }
                                                        
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    Linoria.Component.displayName = "LinoriaComponent";

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