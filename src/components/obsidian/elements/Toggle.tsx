import { CheckIcon } from "lucide-react";
import { useState } from "react";

export default function Toggle({
  text,
  checked,
}: {
  text: string;
  checked: boolean;
}) {
  const [isChecked, setChecked] = useState<boolean>(checked);

  return (
    <div
      className="relative gap-2"
      onClick={(e) => {
        e.preventDefault();
        setChecked(!isChecked);
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
