import { useMemo } from "react";
import Label from "./Label";

const ColorScheme = {
  ["Warning"]: {
    Background: "#7f0000",
    Border: "#ff3232",
    Title: "#ff3232",
    Text: "#ffffff",
  },

  ["Normal"]: {
    Background: "#0f0f0f",
    Border: "#282828",
    Title: "#ffffff",
    Text: "#ffffff",
  },
};

const MAX_HEIGHT_PX = 120;

export default function ObsidianWarningBox({
  text,
  title,
  isnormal,
  locksize,
  visible,
}: {
  text: string;
  title: string;
  isnormal: boolean;
  locksize: boolean;
  visible: boolean;
}) {
  if (!visible) return null;

  const scheme = useMemo(
    () => (isnormal ? ColorScheme.Normal : ColorScheme.Warning),
    [isnormal]
  );

  return (
    <div
      className="w-[calc(100%-20px)] flex flex-col rounded-[3px] m-2.5 px-2 py-1 border"
      style={{ backgroundColor: scheme.Background, borderColor: scheme.Border }}
    >
      <Label
        className="text-[12px] font-normal select-text"
        style={{ color: scheme.Title }}
      >
        {title || (isnormal ? "INFO" : "WARNING")}
      </Label>
      <div
        className={locksize ? "overflow-y-auto" : "overflow-visible"}
        style={locksize ? { maxHeight: MAX_HEIGHT_PX } : undefined}
      >
        <Label className="text-[13px] font-normal">{text}</Label>
      </div>
    </div>
  );
}
