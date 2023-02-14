import { FC } from "react";

export const Typography: FC = () => {
  return (
    <div>
      <div className="text-xs">extra small</div>
      <div className="text-sm">small</div>
      <div className="text-base">base</div>
      <div className="text-lg">large</div>
      <div className="text-xl">extra large</div>
    </div>
  );
};
