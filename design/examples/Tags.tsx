import { FC } from "react";
import { Tag } from "@ggbot2/design";

export const Tags: FC = () => {
  return (
    <div>
      <div>
        <Tag>pill</Tag>
      </div>
      <div>
        <Tag color="primary">Primary</Tag>
      </div>
      <div>
        <Tag color="light">Light</Tag>
      </div>
      <div>
        <Tag color="danger">Danger</Tag>
      </div>

      <div>
        <span>gruped tags</span>
        <div>
          <Tag>Tag</Tag>
          <Tag color="primary">Primary</Tag>
          <Tag color="light">Light</Tag>
        </div>
      </div>
    </div>
  );
};
