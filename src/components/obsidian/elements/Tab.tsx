import type { ReactNode } from "react";

export function TabContainer({ children }: { children: ReactNode }) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-row w-full h-full overflow-hidden min-h-0">{children}</div>
        </div>
    );
}

export function TabLeft({ children }: { children: ReactNode }) {
    return (
        <div className="flex-1 pr-1 h-full overflow-y-auto no-scrollbar min-h-0">
            {children}
        </div>
    );
}

export function TabRight({ children }: { children: ReactNode }) {
    return (
        <div className="flex-1 mr-2 h-full overflow-y-auto no-scrollbar min-h-0">
            {children}
        </div>
    );
}
