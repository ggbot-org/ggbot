import { FC } from "react";
import { Navbar, NavbarBrand, NavbarItem } from "trunx";
import { Logo, classNames } from "@ggbot2/design";

export const Nav: FC = () => {
  return (
    <Navbar color="black">
      <NavbarBrand>
        <NavbarItem>
          <Logo size={24} />
          <span>
            ggbot<b className={classNames("has-text-brand")}>2</b>
          </span>
        </NavbarItem>
      </NavbarBrand>
    </Navbar>
  );
};
