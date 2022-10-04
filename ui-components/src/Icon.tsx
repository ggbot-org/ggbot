import { ReactNode, SVGAttributes, useMemo } from "react";

export const iconNames = [
  "caret-left",
  "caret-right",
  "danger",
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
  danger: {
    jsx: (
      <g fill="currentColor">
        <path d="M507.494,426.066L282.864,53.537c-5.677-9.415-15.87-15.172-26.865-15.172c-10.995,0-21.188,5.756-26.865,15.172 L4.506,426.066c-5.842,9.689-6.015,21.774-0.451,31.625c5.564,9.852,16.001,15.944,27.315,15.944h449.259 c11.314,0,21.751-6.093,27.315-15.944C513.508,447.839,513.336,435.755,507.494,426.066z M256.167,167.227 c12.901,0,23.817,7.278,23.817,20.178c0,39.363-4.631,95.929-4.631,135.292c0,10.255-11.247,14.554-19.186,14.554 c-10.584,0-19.516-4.3-19.516-14.554c0-39.363-4.63-95.929-4.63-135.292C232.021,174.505,242.605,167.227,256.167,167.227z M256.498,411.018c-14.554,0-25.471-11.908-25.471-25.47c0-13.893,10.916-25.47,25.471-25.47c13.562,0,25.14,11.577,25.14,25.47 C281.638,399.11,270.06,411.018,256.498,411.018z" />
      </g>
    ),
    viewBox: "0 0 512 512",
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
