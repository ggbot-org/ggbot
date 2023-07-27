import { Flex } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";

export const FlowMenu: FC<PropsWithChildren> = ({ children }) => (
  <Flex>{children}</Flex>
);
