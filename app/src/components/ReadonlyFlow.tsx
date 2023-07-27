import { FC } from "react";

import { FlowMenu } from "../components/FlowMenu.js";
import {
  FlowViewContainer,
  FlowViewContainerRef,
} from "../components/FlowViewContainer.js";
import { GoCopyStrategy } from "../components/GoCopyStrategy.js";
import { ShareStrategy } from "../components/ShareStrategy.js";

type Props = {
  flowViewContainerRef: FlowViewContainerRef;
};

export const ReadonlyFlow: FC<Props> = ({ flowViewContainerRef }) => (
  <>
    <FlowMenu
      actions={[
        {
          key: "share",
          content: <ShareStrategy />,
        },
        {
          key: "copy",
          content: <GoCopyStrategy />,
        },
      ]}
    />

    <FlowViewContainer ref={flowViewContainerRef} />
  </>
);
