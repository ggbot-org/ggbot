import { Buttons } from "@ggbot2/design";
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
    <FlowMenu>
      <Buttons>
        <ShareStrategy />

        <GoCopyStrategy />
      </Buttons>
    </FlowMenu>

    <FlowViewContainer ref={flowViewContainerRef} />
  </>
);
