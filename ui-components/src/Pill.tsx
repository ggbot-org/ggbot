import { FC, HTMLAttributes, useMemo } from "react";
import { Color } from "./Color";

export type PillProps = Omit<HTMLAttributes<HTMLSpanElement>, "className"> & {
  color?: Extract<Color, "primary" | "neutral" | "danger">;
};

function colorClassNames({ color }: Pick<PillProps, "color">) {
  switch (color) {
    case "primary":
      return "bg-cyan-100 dark:bg-cyan-200 border-cyan-400 text-cyan-800";
    case "neutral":
      return "bg-neutral-100 text-neutral-500 dark:bg-neutral-500 dark:text-neutral-800";
    case "danger":
      return "bg-yellow-300 text-yellow-800";
    default:
      return "bg-white border-neutral-300 text-neutral-800";
  }
}

export const Pill: FC<PillProps> = ({ children, color, ...props }) => {
  const className = useMemo(
    () =>
      [
        "shadow px-2 py-1 select-none",
        "first:rounded-tl-lg first:rounded-bl-lg",
        "last:rounded-tr-lg last:rounded-br-lg",
        colorClassNames({ color }),
      ].join(" "),
    [color]
  );

  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
};
