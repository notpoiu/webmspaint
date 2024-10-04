import { cn } from "@/lib/utils";
import { theme } from "../linoria";

export const LinoriaTabButton: React.FC<{data: theme, onClick: () => void, name: string, active: boolean, index: number, TabPadding: number}> = ({data, onClick, name, active, index, TabPadding}) => {
    return (
        <div key={index} className={cn("flex justify-center items-center w-max h-max p-1 max-h-[20px]", `px-[${TabPadding}px]`)} style={
            active ? { 
                borderRight: "2px solid #" + data.OutlineColor,
                //borderLeft: "1.75px solid #" + data.OutlineColor,
                background: active ? ("#" + data.MainColor) : ("#" + data.BackgroundColor)
            } : { 
                borderRight: "2px solid #" + data.OutlineColor,
                borderBottom: "2px solid #" + data.OutlineColor,
                background: active ? ("#" + data.MainColor) : ("#" + data.BackgroundColor)
            }}
        onClick={onClick}>

            <p style={{
                color: "#" + data.FontColor
            }}>{name}</p>

        </div>
    )
}