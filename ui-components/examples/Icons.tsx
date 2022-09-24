import { FC } from "react";
import { Icon } from "../src";

export const IconList: FC = () => {
  return (
    <div className="flex flex-row p-2">
      <Icon name="caret-left" />
      <Icon name="caret-right" />
    </div>
  );
};
