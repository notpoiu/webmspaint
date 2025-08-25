import React from "react";
import { ButtonBase } from "./Button";
import Label from "./Label";

export default function Input({
  text,
  value,
  placeholder,
}: {
  text: string;
  value: string;
  placeholder: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (inputRef && inputRef.current && !initialized) {
      setInitialized(true);

      inputRef.current.value = value;
      inputRef.current.placeholder = placeholder;
    }
  }, [inputRef]);

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-white opacity-100">{text}</Label>

      <ButtonBase
        text={
          <input
            name="input"
            type="text"
            className="w-full h-full text-white opacity-100 ml-1 text-xs select-none"
            ref={inputRef}
          />
        }
        className="text-left text-white opacity-100 m-1 text-xs"
        containerClassName="justify-start flex relative"
        replacedText={true}
      />
    </div>
  );
}
