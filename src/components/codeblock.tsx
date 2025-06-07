"use client";

import CopyButton from "@/components/copy-button";
import { nord, CodeBlock } from "react-code-blocks";

export function ClientCodeBlock({serial}: {serial: string}) {
    return (
        <>
            <CodeBlock
                text={`script_key="${serial}";\nloadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()`}
                language={"lua"}
                showLineNumbers={false}
                theme={nord}
            />

            <CopyButton text={`script_key="${serial}";\nloadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/002c19202c9946e6047b0c6e0ad51f84.lua"))()`} />   
        </>
    )
}