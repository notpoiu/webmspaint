import React from "react";
import { Card, CardHeader } from "./ui/card";
import { CircleMinus, CircleCheck, CircleAlert } from "lucide-react";
import Image from "next/image";

export default function GameCard({ title, id, image, status, issues, gamesStatusData }: { title: string, id: number | undefined, image: string, status?: boolean, issues?: boolean, gamesStatusData: { [key: string]: string } }) {
  let statusEmoji = title in gamesStatusData ? gamesStatusData[title] : "🟢";
  if (status == false) {
    statusEmoji = "🔴";
  } else if (status == true) {
    if (issues == true) statusEmoji = "🟡";
    else                statusEmoji = "🟢";
  }
  
  return (
    <Card className="w-72 bg-zinc-900 text-white overflow-hidden">
      <div className="h-40 w-full overflow-hidden">
        <Image 
          src={image} 
          alt={title}
          width={0} height={0} sizes={"100vw"}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <a className="text-lg font-semibold transition-all duration-300 underline decoration-transparent hover:decoration-white" target="_blank" href={"https://roblox.com/games/" + id?.toString() + "/" + title}>{title}</a>
        { statusEmoji == "🔴" ? <CircleMinus className="text-red-500" /> : (statusEmoji == "🟡" ? <CircleAlert className="text-yellow-500" /> : <CircleCheck className="text-green-500" />) }
      </CardHeader>
    </Card>
  );
}