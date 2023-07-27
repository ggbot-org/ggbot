import { Navbar, NavbarEnd, NavbarItem, NavbarMenu } from "@ggbot2/design";
import { FC, ReactNode } from "react";

type FlowMenuProps = { actions: { key: string; content: ReactNode }[] };

export const FlowMenu: FC<FlowMenuProps> = ({ actions }) => (
  <Navbar isTransparent>
    <NavbarMenu>
      <NavbarEnd>
        {actions.map(({ key, content }) => (
          <NavbarItem key={key}>{content}</NavbarItem>
        ))}
      </NavbarEnd>
    </NavbarMenu>
  </Navbar>
);
