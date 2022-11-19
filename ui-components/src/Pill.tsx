import { FC, HTMLAttributes, useMemo } from "react";

type Color = "primary" | "neutral";

type Props = Omit<HTMLAttributes<HTMLSpanElement>, "className"> & {
  color?: Color;
};

function colorClassNames({ color }: Pick<Props, "color">) {
  switch (color) {
    case "primary":
      return "bg-cyan-100 border-cyan-400 text-cyan-800";
    case "neutral":
      return "bg-neutral-100 border-neutral-400 text-neutral-800";
    default:
      return "bg-white border-neutral-300 text-neutral-800";
  }
}

export const Pill: FC<Props> = ({ children, color, ...props }) => {
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
