"use client";

import { CopyButtonWithText } from "@/components/copy-button";
import { nord, CodeBlock } from "react-code-blocks";

export function getScriptCode(serial: string) {
    return `script_key="${serial}";\nloadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()`;
}

export function ClientCodeBlock({serial, disableCopyButton = false, classNameBlock, classNameButton}: {serial: string, disableCopyButton?: boolean, classNameBlock?: string, classNameButton?: string}) {
    const scriptCode = getScriptCode(serial);
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
            {!disableCopyButton && (
                <div className={classNameButton}>
                    <CopyButtonWithText text={scriptCode} /> 
                </div>
            )}
        </> 
    )
}