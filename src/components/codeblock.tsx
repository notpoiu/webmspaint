"use client";

import { CopyButtonWithText } from "@/components/copy-button";
import { nord, CodeBlock } from "react-code-blocks";

export function ClientCodeBlock({serial, classNameBlock, classNameButton}: {serial: string, classNameBlock?: string, classNameButton?: string}) {
    const scriptCode = `script_key="${serial}";\nloadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()`;
    return (
        <>
            <div className={classNameBlock}>
                <CodeBlock
                    text={scriptCode}
                    language={"lua"}
                    showLineNumbers={false}
                    theme={nord}
                />
            </div>
            <div className={classNameButton}>
                <CopyButtonWithText text={scriptCode} /> 
            </div>
        </> 
    )
}