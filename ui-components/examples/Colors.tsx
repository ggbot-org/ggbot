import { FC, ReactNode } from "react";

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
        <BgColor color="mono-100">
          <TextColor color="mono-800">mono-100</TextColor>
        </BgColor>
        <BgColor color="primary-100">
          <TextColor color="primary-800">primary-100</TextColor>
        </BgColor>
      </div>

      <div className="flex flex-row wrap">
        <BgColor color="white">
          <TextColor color="primary-800">primary-800</TextColor>
        </BgColor>
        <BgColor color="white">
          <TextColor color="mono-800">mono-800</TextColor>
        </BgColor>
      </div>
    </div>
  );
};
