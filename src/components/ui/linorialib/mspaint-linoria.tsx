"use client";

import LinoriaUI from "./linoria";

export const Library = LinoriaUI({
  Title: "mspaint v3 | DOORS",
  TabPadding: 2,
})

const Tabs = {
    Main: Library.AddTab("Main"),
    Exploits: Library.AddTab("Exploits"),
    Visuals: Library.AddTab("Visuals"),
    Floor: Library.AddTab("Floor"),
	["UI Settings"]: Library.AddTab("UI Settings"),
}

const testingGroupbox = Tabs.Main.AddLeftGroupbox("Testing");
const testingGroupbox2 = Tabs.Main.AddRightGroupbox("Testing2");
testingGroupbox.AddToggle("TestingToggle", {
    Text: "Testing",
    Default: false,
    Tooltip: "Testing",
    Callback: (value: boolean) => {
        console.log(value)
    }
})

testingGroupbox2.AddToggle("TestingToggle2", {
    Text: "Testing2",
    Default: false,
    Tooltip: "Testing2",
    Callback: (value: boolean) => {
        console.log(value)
    }
})

export default function MSPaintLinoria() {
  return <Library.Component className="max-w-[500px] min-h-[500px] mb-[25vh] mt-[15vh] ml-auto mr-auto" componentHeight={500} />
}