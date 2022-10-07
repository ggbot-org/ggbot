import { ChangeEventHandler, FC, InputHTMLAttributes, useMemo } from "react";

type Color = "primary" | "danger";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & { color?: Color };

export type CheckboxOnChange = ChangeEventHandler<HTMLInputElement>;

function colorClassNames({
  disabled,
  color,
}: Pick<CheckboxProps, "color" | "disabled">) {
  switch (true) {
    case disabled:
      return "";
    case color === "primary":
      return "accent-primary-300";
    case color === "danger":
      return "accent-danger-300";
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
