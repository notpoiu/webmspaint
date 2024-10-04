import React from "react";
import { theme } from "../linoria";

export const LinoriaGroupBox: React.FC<{data: theme, first: boolean, name: string | null, children: React.ReactNode}> = ({data, first, name, children}) => {
    return (
        <div className={"m-[7px] border-[2px] min-w-full" + (first ? "mr-[5px]" : "ml-[5px]")} style={{ 
            background: "#" + data.BackgroundColor,
            borderColor: "#" + data.OutlineColor,
            height: "fit-content",
            width: "100%"
        }}>
            <div className={"mt-[1px] mb-[1px] h-[2px]"} style={{ 
                background: "#" + data.AccentColor,
                borderColor: "#" + data.AccentColor,
            }} />

            <div className={"border-[1.5px]"} style={{ 
                background: "#" + data.BackgroundColor,
                borderColor: "#000000"
            }}>
                {name != null && <p className={"ml-[3px]"} style={{
                    color: "#" + data.FontColor,
                    fontSize: "11px",
                }}>{name}</p>}
                {children}
            </div>
        </div>
    );
}