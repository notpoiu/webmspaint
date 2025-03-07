import { BoxesIcon, BugIcon, EarthIcon, EllipsisIcon, FilesIcon, HouseIcon, LinkIcon, MapPinnedIcon, MessageSquareShareIcon, ScanEyeIcon, SettingsIcon, SparklesIcon, UserRoundIcon, WrenchIcon } from "lucide-react";
import { ObsidianGroupboxSection } from "@/components/obsidian/obsidian";

export const LatestBuild = "0.2.0.3";

const IncludedTabs = [
    {
        title: "UI Settings",
        icon: SettingsIcon,
        tabContent: (
            <div className="max-w-full h-full flex flex-row justify-center">
                <ObsidianGroupboxSection>
                    <img src="/menu/left_uisettings.png" alt="left" />
                </ObsidianGroupboxSection>
                <ObsidianGroupboxSection>
                    <img src="/menu/right_uisettings.png" alt="right" />
                </ObsidianGroupboxSection>
            </div>
        )
    },
    {
        title: "Credits",
        icon: MessageSquareShareIcon,
        tabContent: (
            <div className="max-w-full h-full flex flex-row justify-center">
                <ObsidianGroupboxSection>
                    <img src="/menu/left_credits.png" alt="left" />
                </ObsidianGroupboxSection>
                <ObsidianGroupboxSection>
                    <img src="/menu/right_credits.png" alt="right" />
                </ObsidianGroupboxSection>
            </div>
        )
    },
    {
        title: "Addons",
        icon: BoxesIcon,
        tabContent: (
            <img src="/menu/addons_warning.png" alt="warning box" />
        )
    }
]

const ObsidianTabContainer = ({ left, right, header }: { left?: string, right?: string, header?: string }) => {
    return (
        <div className="max-w-full h-full flex flex-col justify-center">
            {header && <img src={`https://raw.githubusercontent.com/mspaint-cc/assets/refs/heads/main/images${header}`} alt="warning box" />}
            <div className="max-w-full h-full flex flex-row justify-center">
                <ObsidianGroupboxSection>
                    <img src={`https://raw.githubusercontent.com/mspaint-cc/assets/refs/heads/main/images${left ?? "/menu/empty.png"}`} alt="left" />
                </ObsidianGroupboxSection>
                <ObsidianGroupboxSection>
                    <img src={`https://raw.githubusercontent.com/mspaint-cc/assets/refs/heads/main/images${right ?? "/menu/empty.png"}`} alt="right" />
                </ObsidianGroupboxSection>
            </div>
        </div>
    )
}


export const MenuMapping = {
    "DOORS": {
        "The Hotel": {
            "Game": "DOORS",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_main_hotel.png"
                            right="/menu/doors/right_main_hotel.webp"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_exploits_hotel.png"
                            right="/menu/doors/right_exploits_hotel.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_visuals_hotel.png"
                            right="/menu/doors/right_visuals_hotel.png"
                        />
                },
                {
                    title: "Floor",
                    icon: SparklesIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_floor_hotel.png"
                            right="/menu/doors/right_floor_hotel.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "Backdoor": {
            "Game": "DOORS",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_main_hotel.png"
                            right="/menu/doors/right_main_backdoor.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_exploits_hotel.png"
                            right="/menu/doors/right_exploits_hotel.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_visuals_hotel.png"
                            right="/menu/doors/right_visuals_hotel.png"
                        />
                },
                {
                    title: "Floor",
                    icon: SparklesIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_floor_backdoor.png"
                            right="/menu/doors/right_floor_backdoor.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "The Mines": {
            "Game": "DOORS",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_main_hotel.png"
                            right="/menu/doors/right_main_mines.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_exploits_hotel.png"
                            right="/menu/doors/right_exploits_hotel.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_visuals_hotel.png"
                            right="/menu/doors/right_visuals_hotel.png"
                        />
                },
                {
                    title: "Floor",
                    icon: SparklesIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_floor_mines.png"
                            right="/menu/doors/right_floor_mines.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "The Rooms": {
            "Game": "DOORS",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_main_hotel.png"
                            right="/menu/doors/right_main_backdoor.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_exploits_hotel.png"
                            right="/menu/doors/right_exploits_hotel.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_visuals_hotel.png"
                            right="/menu/doors/right_visuals_hotel.png"
                        />
                },
                {
                    title: "Floor",
                    icon: SparklesIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_floor_rooms.png"
                            right="/menu/doors/right_floor_rooms.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "Hotel-": {
            "Game": "DOORS (Doors)",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_main_hotel-.png"
                            right="/menu/doors/right_main_hotel.webp"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_exploits_hotel-.png"
                            right="/menu/doors/right_exploits_hotel-.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_visuals_hotel.png"
                            right="/menu/doors/right_visuals_hotel.png"
                        />
                },
                {
                    title: "Floor",
                    icon: SparklesIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_floor_hotel-.png"
                            right="/menu/doors/right_floor_hotel-.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "Super Hard Mode": {
            "Game": "DOORS",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_main_hotel-.png"
                            right="/menu/doors/right_main_hotel.webp"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_exploits_hotel-.png"
                            right="/menu/doors/right_exploits_shm.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_visuals_hotel.png"
                            right="/menu/doors/right_visuals_hotel.png"
                        />
                },
                {
                    title: "Floor",
                    icon: SparklesIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_floor_shm.png"
                            right="/menu/doors/right_floor_shm.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "Retro Mode": {
            "Game": "DOORS",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_main_hotel.png"
                            right="/menu/doors/right_main_backdoor.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_exploits_hotel.png"
                            right="/menu/doors/right_exploits_hotel.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_visuals_hotel.png"
                            right="/menu/doors/right_visuals_hotel.png"
                        />
                },
                {
                    title: "Floor",
                    icon: SparklesIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/doors/left_floor_retro.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "Lobby": {
            "Game": "DOORS (Lobby)",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent:
                        <ObsidianTabContainer
                            left="/menu/doors/left_main_lobby.png"
                            right="/menu/doors/right_main_lobby.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    },

    "Fisch": {
        "Fisch": {
            "Game": "Fisch",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/fisch/left_main.png"
                            right="/menu/fisch/right_main.png"
                        />
                },
                {
                    title: "Player",
                    icon: UserRoundIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/fisch/left_player.png"
                            right="/menu/fisch/right_player.png"
                        />
                },
                {
                    title: "Items",
                    icon: FilesIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/fisch/left_items.png"
                            right="/menu/fisch/right_items.png"
                        />
                },
                {
                    title: "World",
                    icon: EarthIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/fisch/left_world.png"
                            right="/menu/fisch/right_world.png"
                        />
                },
                {
                    title: "Misc",
                    icon: EllipsisIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/fisch/left_misc.png"
                            right="/menu/fisch/right_misc.png"
                        />
                },
                {
                    title: "Webhooks",
                    icon: LinkIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/fisch/left_webhooks.png"
                            right="/menu/fisch/right_webhooks.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    },

    "R&D": {
        "R&D": {
            "Game": "R&D",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/r&d/left_main.png"
                            right="/menu/r&d/right_main.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/r&d/left_visuals.png"
                            right="/menu/r&d/right_visuals.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    },

    "Pressure": {
        "Pressure": {
            "Game": "Pressure",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/pressure/left_main.png"
                            right="/menu/pressure/right_main.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/pressure/left_exploits.png"
                            right="/menu/pressure/right_exploits.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/pressure/left_visuals.png"
                            right="/menu/pressure/right_visuals.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "Raveyard": {
            "Game": "Pressure",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/pressure/left_main.png"
                            right="/menu/pressure/right_main.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/pressure/left_exploits_raveyard.png"
                            right="/menu/pressure/right_exploits_raveyard.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/pressure/left_visuals.png"
                            right="/menu/pressure/right_visuals.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "Lobby": {
            "Game": "Pressure (Lobby)",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/pressure/left_main_lobby.png"
                            right="/menu/pressure/right_main_lobby.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    },

    "3008": {
        "3008": {
            "Game": "3008",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/3008/left_main.png"
                            right="/menu/3008/right_main.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/3008/left_exploits.png"
                            right="/menu/3008/right_exploits.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/3008/left_visuals.png"
                            right="/menu/3008/right_visuals.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    },

    "BABFT": {
        "Build A Boat For Treasure": {
            "Game": "Build A Boat For Treasure",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/babft/left_main.png"
                            right="/menu/babft/right_main.png"
                        />
                },
                {
                    title: "Builds",
                    icon: WrenchIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/babft/left_builds.png"
                            right="/menu/babft/right_builds.png"
                            header="/menu/babft/warning_builds.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/babft/left_exploits.png"
                            right="/menu/babft/right_exploits.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    },

    "Grace": {
        "Grace": {
            "Game": "Grace [BETA]",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/grace/left_main.png"
                            right="/menu/grace/right_main.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/grace/left_visuals.png"
                            right="/menu/grace/right_visuals.png"
                        />
                },

                ...IncludedTabs
            ]
        },
    },

    "Murder Mystery 2": {
        "Murder Mystery 2": {
            "Game": "Murder Mystery 2 [BETA]",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/mm2/left_main.png"
                            right="/menu/mm2/right_main.png"
                        />
                },
                {
                    title: "Player",
                    icon: UserRoundIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/mm2/left_player.png"
                        />
                },
                {
                    title: "Teleport",
                    icon: MapPinnedIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/mm2/left_teleport.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/mm2/left_visuals.png"
                            right="/menu/mm2/right_visuals.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    },

    "Shrimp Game": {
        "Shrimp Game": {
            "Game": "Shrimp Game [BETA]",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/shrimp game/left_main.png"
                            right="/menu/shrimp game/right_main.png"
                        />
                },
                ...IncludedTabs
            ]
        },
        "Lobby": {
            "Game": "Shrimp Game [BETA]",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/shrimp game/left_main_lobby.png"
                        />
                },
                
                ...IncludedTabs
            ]
        }
    },

    "Word Bomb": {
        "Word Bomb": {
            "Game": "Word Bomb",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/word bomb/left_main.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    },

    "Notoriety": {
        "Notoriety": {
            "Game": "Notoriety [BETA]",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/notoriety/left_main.png"
                            right="/menu/notoriety/right_main.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/notoriety/left_visuals.png"
                            right="/menu/notoriety/right_visuals.png"
                        />
                },

                ...IncludedTabs
            ]
        },

        "Lobby": {
            "Game": "Notoriety [BETA]",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/notoriety/left_main_lobby.png"
                        />
                },
                
                ...IncludedTabs
            ]
        }
    },

    "Universal": {
        "Universal": {
            "Game": "Universal",
            "Tabs": [
                {
                    title: "Main",
                    icon: HouseIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/universal/left_main.png"
                        />
                },
                {
                    title: "Exploits",
                    icon: BugIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/universal/left_exploits.png"
                            right="/menu/universal/right_exploits.png"
                        />
                },
                {
                    title: "Visuals",
                    icon: ScanEyeIcon,
                    tabContent: 
                        <ObsidianTabContainer
                            left="/menu/universal/left_visuals.png"
                            right="/menu/universal/right_visuals.png"
                        />
                },

                ...IncludedTabs
            ]
        }
    }
}