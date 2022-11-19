import { ChangeEventHandler, FC, InputHTMLAttributes, useMemo } from "react";
import { Color } from "./Color";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & { color?: Extract<Color, "primary" | "danger"> };

export type CheckboxOnChange = ChangeEventHandler<HTMLInputElement>;

function colorClassNames({
  disabled,
  color,
}: Pick<CheckboxProps, "color" | "disabled">) {
  switch (true) {
    case disabled:
      return "";
    case color === "primary":
      return "accent-cyan-300";
    case color === "danger":
      return "accent-yellow-300";
    default:
      return "";
  }
}
export const Checkbox: FC<CheckboxProps> = ({ color, disabled, ...props }) => {
  const className = useMemo(
    () => ["cursor-pointer", colorClassNames({ color, disabled })].join(" "),
    [color, disabled]
  );

  return <input className={className} type="checkbox" {...props} />;
};
