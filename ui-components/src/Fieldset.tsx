import { FC, FieldsetHTMLAttributes, ReactNode, useMemo } from "react";
import { Color } from "./Color";

export type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  color?: Extract<Color, "danger">;
  legend?: ReactNode;
};

function colorClassNames({ color }: Pick<FieldsetProps, "color">) {
  const transition = "transition-colors ease-in";
  switch (true) {
    case color === "danger":
      return `bg-yellow-50 hover:bg-yellow-200 ${transition}`;
    default:
      return `bg-teal-50/50 hover:bg-teal-50 ${transition}`;
  }
}

export const Fieldset: FC<FieldsetProps> = ({ children, color, legend }) => {
  const fieldsetClassName = useMemo(
    () =>
      `${colorClassNames({
        color,
      })} w-full lg:max-w-lg my-2 p-4 shadow dark:shadow-black rounded`,
    [color]
  );

  const legendClassname = "bg-inherit px-4 py-2 rounded-md";

  return (
    <fieldset className={fieldsetClassName}>
      <legend className={legendClassname}>{legend}</legend>
      {children}
    </fieldset>
  );
};
