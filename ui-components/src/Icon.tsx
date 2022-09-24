import { ReactNode, SVGAttributes, useMemo } from "react";

export const iconNames = [
  "caret-left",
  "caret-right",
  "dots-vertical",
] as const;
export type IconName = typeof iconNames[number];

type IconDefinition = {
  jsx: ReactNode;
  viewBox: SVGAttributes<SVGSVGElement>["viewBox"];
};

const iconRecord: Record<IconName, IconDefinition> = {
  "caret-left": {
    jsx: (
      <g fill="currentColor">
        <polyline points="10.293 19.707 0.586 10 10.293 0.293 11.707 1.707 3.414 10 11.707 18.293 10.293 19.707" />
      </g>
    ),
    viewBox: "0 0 15 20",
  },
  "caret-right": {
    jsx: (
      <g fill="currentColor">
        <polyline points="1.707 19.707 0.293 18.293 8.586 10 0.293 1.707 1.707 0.293 11.414 10 1.707 19.707" />
      </g>
    ),
    viewBox: "0 0 10 20",
  },
  "dots-vertical": {
    jsx: (
      <g fill="currentColor">
        <circle r={2} cx={10} cy={4} />
        <circle r={2} cx={10} cy={10} />
        <circle r={2} cx={10} cy={16} />
      </g>
    ),
    viewBox: "0 0 20 20",
  },
};

export type IconProps = Pick<SVGAttributes<SVGSVGElement>, "onClick"> & {
  name: IconName;
  /**
   * Icon `size` can be a number to represent pixel units,
   * or a string to represent em or rem units.
   */
  size?: number | `${number}em` | `${number}rem`;
};

export const Icon: React.FC<IconProps> = ({ name, onClick, size = "1em" }) => {
  const { viewBox, jsx } = useMemo(() => iconRecord[name], [name]);

  const className = useMemo(
    () => [typeof onClick === "function" ? "cursor-pointer" : ""].join(" "),
    [onClick]
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      {jsx}
    </svg>
  );
};
