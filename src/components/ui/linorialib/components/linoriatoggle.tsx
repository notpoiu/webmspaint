import { theme } from "../linoria";

export const LinoriaToggle: React.FC<{data: theme, onClick: () => void, name: string, active: boolean, index: number}> = ({data, onClick, name, active, index}) => {
    return (
        <div className={"flex flex-row items-center gap-1"}>
            <div key={index} className={"border-[1.45px] flex justify-center items-center p-1 min-w-[12px] min-h-[12px]"} style={{ 
                borderColor: "#" + data.OutlineColor,
                background: active == false ? ("#" + data.BackgroundColor) : ("#" + data.AccentColor),
            }} onClick={onClick}>
                <div key={index} className={"absolute border-[1.45px] min-w-[10px] min-h-[10px]"} style={{ 
                    borderColor: "rgba(0,0,0,0.15)"
                }} />
            </div>

            <p style={{
                color: "#" + data.FontColor
            }}>{name}</p>
        </div>
    )
}