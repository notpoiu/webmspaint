import type { ReactNode } from "react";

export default function AddonContainer({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center pointer-events-auto z-40">
        {children}
      </div>
    </div>
  );
}
