import { FC } from "react";
import { Pill } from "@ggbot2/design";

export const Tags: FC = () => {
  return (
    <div>
      <div>
        <Pill>pill</Pill>
      </div>
      <div>
        <Pill color="primary">primary</Pill>
      </div>
      <div>
        <Pill color="neutral">neutral</Pill>
      </div>
      <div>
        <Pill color="danger">danger</Pill>
      </div>

      <div>
        <span>gruped tags</span>
        <div>
          <Pill>pill</Pill>
          <Pill color="primary">primary</Pill>
          <Pill color="neutral">neutral</Pill>
        </div>
      </div>
    </div>
  );
};
