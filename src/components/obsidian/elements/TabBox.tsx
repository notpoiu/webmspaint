import { useState } from "react";
import { ElementParser } from "../DynamicTab";
import { TabboxTab } from "../element.types";

/**
 * Renders a tabbed container where each tab's content is rendered by ElementParser.
 *
 * Tabs are displayed in ascending order using each tab's optional `order` property (missing orders default to 0).
 * The first tab in that sorted order becomes the initial active tab. Clicking a tab switches the active view.
 *
 * @param tabs - Map of tab name to TabboxTab; each TabboxTab is expected to include an `elements` array that ElementParser can render. Tab ordering uses each tab's optional `order` numeric field.
 * @param scope - Prefix used to scope element state keys; passed to each ElementParser as `stateKeyPrefix` in the form `${scope}:tab:${activeTab}`.
 * @returns The tabbed JSX element, or `null` when `tabs` is empty.
 */
export default function Tabbox({ tabs, scope }: { tabs: {[key: string]: TabboxTab}, scope: string }) {
    const tabNames = Object.keys(tabs).sort((a, b) => (tabs[a]?.order ?? 0) - (tabs[b]?.order ?? 0));
    const [activeTab, setActiveTab] = useState(tabNames[0]);

    if (tabNames.length === 0) return null;
    const activeTabData = tabs[activeTab];

    return (
        <div className="mt-1 ml-2 mb-3 rounded-[3px] bg-[rgb(15,15,15)] border border-[rgb(40,40,40)] relative font-normal">
            <div className="w-full h-[38px] flex flex-row bg-[rgb(15,15,15)]">
                {/* Buttons */}
                <div className="flex flex-row items-center w-full border-b border-b-[rgb(40,40,40)]">
                    {tabNames && tabNames.map(name => (
                        <button
                            key={name}
                            onClick={() => setActiveTab(name)}
                            className={`flex-1 h-full text-sm ${activeTab == name ? 'text-white' : 'bg-[rgb(40,40,40)] text-white opacity-50'}`}
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
