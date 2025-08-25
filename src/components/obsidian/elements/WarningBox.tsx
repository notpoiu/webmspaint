export default function ObsidianWarningBox({ text }: { text: string }) {
    return (
        <div className="w-full flex justify-center bg-transparent">
            <div className="h-14 bg-[#111111] flex items-center px-2 w-full">
                <div className="flex w-full flex-col items-start bg-[#7f0000] border border-[#ff3232] px-2 py-1">
                    <span className="text-[#da1c1c] text-[12px] font-normal">WARNING</span>
                    <p className="text-white text-[13px] font-normal">{text}</p>
                </div>
            </div>
        </div>
    );
}