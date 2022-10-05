import { FC } from "react";
import { Pill } from "../src/Pill";

export const Pills: FC = () => {
  return (
    <div className="flex flex-row gap-2 wrap">
      <div>
        <Pill>pill</Pill>
      </div>
      <div>
        <Pill color="primary">primary</Pill>
      </div>
      <div>
        <Pill color="neutral">neutral</Pill>
      </div>
    </div>
  );
};

export const GroupedPills: FC = () => {
  return (
    <div className="flex flex-row">
      <Pill>pill</Pill>
      <Pill color="primary">primary</Pill>
      <Pill color="neutral">neutral</Pill>
    </div>
  );
};
