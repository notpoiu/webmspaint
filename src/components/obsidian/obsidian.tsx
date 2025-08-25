import Image from "next/image";
import { MoveDiagonal2, MoveIcon, SearchIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";
import * as LucideIcons from "lucide-react";

import { IBM_Plex_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { TabParser } from "./DynamicTab";
import { uiData } from "@/data/uiData";

export const IBMMono = IBM_Plex_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font",
});

interface ObsidianProps {
  title: string;
  icon?: string;
  footer: string;
}

export function Obsidian({ title, icon, footer }: ObsidianProps) {
  return (
    <div
      className={cn(
        "w-[720px] h-[600px] rounded-[3px] bg-[rgb(15, 15, 15)] border-[rgb(40,40,40)] border relative font-normal",
        IBMMono.className
      )}
    >
      <div className="w-full h-[48px] flex flex-row px-0 bg-[rbga(13,13,13,255)]">
        {/* Title */}
        <div className="flex flex-row items-center justify-center w-[30%] h-full gap-[3px] border-b-[rgb(40,40,40)] border-b">
          {icon && <Image src={icon} width={30} height={30} alt="logo" />}
          <span className="text-white text-sm mt-[5px]">{title}</span>
        </div>

        <div className="w-[70%] h-full flex flex-row items-center gap-[3px] border-l-[rgb(40,40,40)] border-l border-b-[rgb(40,40,40)] border-b">
          <div className="absolute mt-0 left-[214px] w-[505px] h-[49px] flex items-center">
            {/* Searchbox */}
            <div className="flex items-center w-[449px] h-[34px] ml-[8px] mt-[1px] bg-[#191919] border border-[#272727] rounded px-2">
              <SearchIcon className="text-[#5f5f5f] mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="w-full mt-[4px] text-center text-[13.5px] text-[#fff] bg-transparent placeholder-[#5f5f5f] outline-none"
              />
            </div>

            {/* Move Icon */}
            <MoveIcon className="text-[rgb(40,40,40)] ml-auto mr-auto" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue={"Home"}
        className="h-[calc(100%-69px)] w-full flex flex-row bg-[#111111]"
      >
        <TabsList className="h-full border-r-[rgb(40,40,40)] border-r min-w-[calc(30%+1.2px)] flex flex-col justify-start bg-[rgba(15,15,15,255)] rounded-none p-0">
          {Object.entries(uiData.tabs)
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([tabName, tab], index) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              const IconTab = LucideIcons[tab.icon];
              return (
                <TabsTrigger
                  value={tabName}
                  key={index}
                  className="flex flex-row items-center justify-start w-full max-h-[40px] min-h-[40px] border-b-[rgb(40,40,40)] border-b rounded-none py-[11px] px-[12px] data-[state=active]:bg-[rgb(25,25,25)] data-[state=active]:text-white"
                >
                  {tab.icon && (
                    <IconTab className="text-[rgb(125,85,255)] h-[calc(100%)] mr-2" />
                  )}
                  <span className="text-[13px] text-opacity-75">{tabName}</span>
                </TabsTrigger>
              );
            })}
        </TabsList>

        {Object.entries(uiData.tabs).map(([tabName, tab], index) => (
          <TabsContent
            value={tabName}
            key={index}
            className="w-full max-w-[calc(100%-30%+1.2px)] bg-[#111111] p-0 mt-0"
          >
            <TabParser tabData={tab} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Footer */}
      <div className="h-[20px] w-full bg-[rgb(15,15,15)] border-t-[rgb(40,40,40)] border-t absolute bottom-0 flex flex-row items-center justify-center">
        <p className="text-[12px] text-white opacity-50">{footer}</p>

        <MoveDiagonal2 className="text-white opacity-50 w-[16px] h-[16px] absolute right-0 mr-[2px] pointer-events-none" />
      </div>
    </div>
  );
}
