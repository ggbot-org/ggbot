// TODO remove Fieldset component, use Section
import { FC, FieldsetHTMLAttributes, ReactNode, useMemo } from "react";
import type { Color } from "./Color";

export type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  color?: Extract<Color, "danger">;
  legend?: ReactNode;
};

function colorClassNames({ color }: Pick<FieldsetProps, "color">) {
  switch (true) {
    case color === "danger":
      return "bg-yellow-100 text-black";
    default:
      return "bg-gray-50 dark:bg-stone-600 text-black dark:text-white";
  }
}

export const Fieldset: FC<FieldsetProps> = ({ children, color, legend }) => {
  const { fieldsetClassName, legendClassname } = useMemo(() => {
    const colors = colorClassNames({ color });
    return {
      fieldsetClassName: `${colors} w-full lg:max-w-lg flex flex-col gap-4 my-2 p-4 rounded`,

      legendClassname: `${colors} px-4 py-2 rounded-md`,
    };
  }, [color]);

  return (
    <fieldset className={fieldsetClassName}>
      <legend className={legendClassname}>{legend}</legend>
      {children}
    </fieldset>
  );
};
