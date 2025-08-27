import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useUIState } from "../uiState";

export default function Toggle({
  text,
  checked,
  stateKey,
}: {
  text: string;
  checked: boolean;
  stateKey?: string;
}) {
  const { state, setState } = useUIState();
  const [isChecked, setChecked] = useState<boolean>(
    (stateKey ? (state[stateKey] as boolean | undefined) : undefined) ?? checked
  );

  useEffect(() => {
    if (!stateKey) return;
    const v = state[stateKey];
    if (typeof v === "boolean") setChecked(v);
  }, [state, stateKey]);

  return (
    <div
      className="relative gap-2"
      onClick={(e) => {
        e.preventDefault();
        const next = !isChecked;
        setChecked(next);
        if (stateKey) setState(stateKey, next);
      }}
    >
      <div className="absolute w-[22px] h-[22px] rounded-[3px] bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] border">
        <CheckIcon
          className={`w-[16px] h-[16px] m-[2px] opacity-${
            isChecked ? "100" : "0"
          } transition-opacity`}
        />
      </div>

      <span
        className={`ml-[28px] text-left block text-white text-sm select-none opacity-${
          isChecked ? "80" : "60"
        } transition-opacity`}
      >
        {text}
      </span>
    </div>
  );
}
