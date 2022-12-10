import { FC, HTMLAttributes, ReactNode, useMemo } from "react";
import type { Color } from "./Color";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  color?: Extract<Color, "danger">;
  header?: ReactNode;
};

function colorClassNames({ color }: Pick<SectionProps, "color">) {
  switch (true) {
    case color === "danger":
      return "bg-yellow-100 text-black";
    default:
      return "bg-gray-50 dark:bg-stone-600 text-black dark:text-white";
  }
}

export const Section: FC<SectionProps> = ({ children, color, header }) => {
  const { sectionClassName, headerClassname } = useMemo(() => {
    const colors = colorClassNames({ color });
    return {
      sectionClassName: `${colors} w-full lg:max-w-lg flex flex-col gap-4 my-2 p-4 rounded`,

      headerClassname: "px-4 py-2",
    };
  }, [color]);

  return (
    <section className={sectionClassName}>
      {header && <header className={headerClassname}>{header}</header>}
      {children}
    </section>
  );
};
