import { useState } from "react";
import { ElementParser, TabboxTab } from "../DynamicTab";

export function Tabbox({ tabs, scope }: { tabs: {[key: string]: TabboxTab}, scope: string }) {
    const tabNames = Object.keys(tabs);
    const [activeTab, setActiveTab] = useState(tabNames[0]);

    if (tabNames.length === 0) return null;
    const activeTabData = tabs[activeTab];

    return (
        <div className="mt-1 ml-2 mb-3 rounded-[3px] bg-[rgb(15,15,15)] border border-[rgb(40,40,40)] relative font-normal">
            <div className="w-full h-[38px] flex flex-row bg-[rgba(13,13,13,1)]">
                {/* Buttons */}
                <div className="flex flex-row items-center w-full border-b border-b-[rgb(40,40,40)]">
                    {tabNames && tabNames.map(name => (
                        <button
                            key={name}
                            onClick={() => setActiveTab(name)}
                            className={`flex-1 h-full text-sm font-semibold ${activeTab == name ? 'text-white' : 'bg-[rgb(40,40,40)] text-white opacity-50'}`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>


            {/* Content */}
            <div className="flex flex-col right p-2 gap-2">
                {activeTabData.elements.map(el => (
                    <ElementParser
                        key={`${activeTab}-${el.index}`}
                        element={el}
                        stateKeyPrefix={`${scope}:tab:${activeTab}`}
                    />
                ))}
            </div>
        </div>
    )
}
