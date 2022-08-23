import { SVGAttributes, useMemo } from "react";

export const iconNames = ["caret-left", "caret-right"] as const;
export type IconName = typeof iconNames[number];

type IconDefinition = {
  fill?: SVGAttributes<SVGSVGElement>["fill"];

  /**
   * Path definition, the `d` attribute of an SVG `path` element.
   */
  shape: SVGAttributes<SVGPathElement>["d"];

  stroke?: SVGAttributes<SVGSVGElement>["stroke"];
  strokeLinecap?: SVGAttributes<SVGSVGElement>["strokeLinecap"];
  strokeLinejoin?: SVGAttributes<SVGSVGElement>["strokeLinejoin"];
  strokeWidth?: SVGAttributes<SVGSVGElement>["strokeWidth"];

  /**
   * SVG viewBox
   */
  viewBox: SVGAttributes<SVGSVGElement>["viewBox"];
};

const iconRecord: Record<IconName, IconDefinition> = {
  "caret-left": {
    fill: "none",
    shape: "M7 1L1 6.5L7 12",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    viewBox: "0 0 8 13",
  },
  "caret-right": {
    fill: "none",
    shape: "M1 12L7 6.5L1 1",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    viewBox: "0 0 8 13",
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
  const {
    viewBox,
    fill,
    shape,
    stroke,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth,
  } = useMemo(() => iconRecord[name], [name]);

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
      <path
        d={shape}
        fill={fill ?? "currentColor"}
        stroke={stroke}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
