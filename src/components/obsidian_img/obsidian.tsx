import Image from "next/image";
import { MoveDiagonal2, MoveIcon, SearchIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";

import { IBM_Plex_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
const mono = IBM_Plex_Mono({
    weight: ['400'],
    subsets: ['latin'],
    variable: '--font'
})

interface TabProps {
    title: string;
    icon?: React.ElementType;
    tabContent: React.ReactNode;
}

interface ObsidianProps {
    title: string;
    icon?: string;
    footer: string;
    tabs: TabProps[];
}

export function Obsidian({
    title,
    icon,
    footer,
    tabs,
}: ObsidianProps) {
    return (
        <div className={cn("w-[720px] h-[600px] rounded-[3px] bg-[rgb(15, 15, 15)] border-[rbg(40,40,40)] border relative font-normal", mono.className)}>
            {/* Top Bar */}
            <div className="w-full h-[48px] flex flex-row px-0 bg-[rbga(13,13,13,255)]">
                {/* Title */}
                <div className="flex flex-row items-center justify-center w-[30%] h-full gap-[3px] border-b-[rgb(40,40,40)] border-b">
                    {icon && <Image src={icon} width={30} height={30} alt="logo" />}
                    <span className="text-white text-sm font-bold">{title}</span>
                </div>

                <div className="w-[70%] h-full flex flex-row items-center gap-[3px] border-l-[rgb(40,40,40)] border-l border-b-[rgb(40,40,40)] border-b">
                    {/* Searchbox */}
                    <div
                        className="w-[calc(100%-57px)] h-[calc(100%-16px)] ml-2 relative"
                    >
                        <input
                            placeholder="Search"
                            className="text-center h-full w-full rounded-[4px] text-white text-opacity-50 border-[rgb(40,40,40)] text-[14px] select-none"
                            readOnly
                        />
                        <div className="absolute left-0 top-0 text-white text-opacity-50 w-[16px] pointer-events-none h-full flex items-center justify-center ml-2">
                            <SearchIcon />
                        </div>
                    </div>

                    {/* Move Icon */}
                    <MoveIcon className="text-[rgb(40,40,40)] ml-auto mr-auto" />
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue={tabs[0].title} className="h-[calc(100%-69px)] w-full flex flex-row bg-[#111111]">
                <TabsList className="h-full border-r-[rgb(40,40,40)] border-r min-w-[calc(30%+1.2px)] flex flex-col justify-start bg-[rgba(15,15,15,255)] rounded-none p-0">
                    {tabs.map((tab, index) => (
                        <TabsTrigger
                            value={tab.title}
                            key={index}
                            className="flex flex-row items-center justify-start w-full max-h-[40px] min-h-[40px] border-b-[rgb(40,40,40)] border-b rounded-none py-[11px] px-[12px] data-[state=active]:bg-[rgb(25,25,25)] data-[state=active]:text-white"
                        >  
                            {tab.icon && (
                                <tab.icon
                                    className="text-[rgb(125,85,255)] h-[calc(100%)] mr-2"
                                />
                            )}
                            <span className="text-[13px] font-bold text-opacity-75">{tab.title}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                {
                    tabs.map((tab, index) => (
                        <TabsContent value={tab.title} key={index} className="max-w-[calc(100%-30%+1.2px)] bg-[#111111] p-0 mt-0">
                            {tab.tabContent}
                        </TabsContent>
                    ))
                }
            </Tabs>


            {/* Footer */}
            <div className="h-[20px] w-full bg-[rgb(15,15,15)] border-t-[rgb(40,40,40)] border-t absolute bottom-0 flex flex-row items-center justify-center">
                <p className="text-[12px] text-white text-opacity-50">{footer}</p>

                <MoveDiagonal2 className="text-white text-opacity-50 w-[16px] h-[16px] absolute right-0 mr-[2px] pointer-events-none" />
            </div>
        </div>
    )
}