import type { FC, ReactNode } from "react";

type ColorProps = { color: string; children: ReactNode };

const BgColor: FC<ColorProps> = ({ color, children }) => {
  // Use a template string on purpose, to avoid TailwindCSS find this color here.
  const className = `bg-${color}`;
  return <div className={className}>{children}</div>;
};

const TextColor: FC<ColorProps> = ({ color, children }) => {
  // Use a template string on purpose, to avoid TailwindCSS find this color here.
  const className = `text-${color} p-4`;
  return <div className={className}>{children}</div>;
};

export const Colors: FC = () => {
  return (
    <div>
      <div className="flex flex-row wrap">
        <BgColor color="white">
          <TextColor color="black">white</TextColor>
        </BgColor>
        <BgColor color="black">
          <TextColor color="white">black</TextColor>
        </BgColor>
        <BgColor color="neutral-100">
          <TextColor color="neutral-800">neutral-100</TextColor>
        </BgColor>
        <BgColor color="cyan-100">
          <TextColor color="cyan-800">cyan-100</TextColor>
        </BgColor>
      </div>

      <div className="flex flex-row wrap">
        <BgColor color="white">
          <TextColor color="cyan-800">cyan-800</TextColor>
        </BgColor>
        <BgColor color="white">
          <TextColor color="neutral-800">neutral-800</TextColor>
        </BgColor>
      </div>
    </div>
  );
};
