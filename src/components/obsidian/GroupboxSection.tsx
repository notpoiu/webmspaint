export function ObsidianGroupboxSection({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-1/2 overflow-x-hidden overflow-y-scroll scrollbar-hide flex items-start justify-center">
            {children}
        </div>
    )
}