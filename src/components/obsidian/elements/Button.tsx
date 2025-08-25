import { cn } from "@/lib/utils";

export function ButtonBase({
  text,
  containerClassName,
  className,
  children,
  replacedText = false,
}: {
  text: string | React.ReactNode;
  containerClassName?: string;
  className?: string;
  children?: React.ReactNode;
  replacedText?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full h-[26px] justify-center rounded-[1px] bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] border-[rgb(40,40,40)] border cursor-pointer",
        containerClassName
      )}
    >
      {!replacedText ? (
        <span
          className={cn(
            `text-center text-white text-sm opacity-50 truncate`,
            className
          )}
        >
          {text}
        </span>
      ) : (
        text
      )}
      {children}
    </div>
  );
}

export default function Button({
  text,
  subButton,
}: {
  text: string;
  subButton?: { text: string };
}) {
  if (subButton != undefined) {
    return (
      <div className="flex flex-row gap-2">
        <ButtonBase text={text} />
        <ButtonBase text={subButton.text} />
      </div>
    );
  }

  return <ButtonBase text={text} />;
}
