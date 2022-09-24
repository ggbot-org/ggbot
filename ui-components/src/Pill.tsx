import { FC, HTMLAttributes, useMemo } from "react";

type Color = "primary" | "neutral";

type Props = HTMLAttributes<HTMLSpanElement> & { color?: Color };

function colorClassNames({ color }: Pick<Props, "color">) {
  switch (color) {
    case "primary":
      return "bg-primary-100 border-primary-400 text-primary-800";
    case "neutral":
      return "bg-mono-100 border-mono-400 text-mono-800";
    default:
      return "bg-white border-mono-300 text-mono-800";
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
