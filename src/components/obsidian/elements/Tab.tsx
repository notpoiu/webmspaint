export function TabContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full overflow-y-auto no-scrollbar flex flex-col">
            <div className="flex flex-row w-full">{children}</div>
        </div>
    );
}

export function TabLeft({ children }: { children: React.ReactNode }) {
    return <div className="w-full pr-1">{children}</div>;
}

export function TabRight({ children }: { children: React.ReactNode }) {
    return <div className="w-full mr-2">{children}</div>;
}