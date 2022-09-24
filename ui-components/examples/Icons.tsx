import { FC } from "react";
import { Icon, iconNames } from "../src";

export const IconList: FC = () => {
  return (
    <div className="flex flex-row p-2">
      {iconNames.map((name) => (
        <Icon key={name} name={name} />
      ))}
    </div>
  );
};
