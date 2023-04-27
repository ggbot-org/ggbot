import { FC } from "react";
import { Icon, iconNames } from "@ggbot2/design";

export const Icons: FC = () => (
  <div>
    {iconNames.map((name) => (
      <Icon key={name} name={name} />
    ))}
  </div>
);
