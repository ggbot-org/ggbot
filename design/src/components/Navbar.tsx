import { FC, PropsWithChildren } from "react";
import { Navbar as _Navbar, NavbarProps as _NavbarProps, NavbarBrand, NavbarItem } from "trunx";
import { Logo } from "./Logo";
import { classNames } from "../classNames";

export type NavbarProps = Omit<_NavbarProps, "color">;

export const Navbar: FC<PropsWithChildren<NavbarProps>> = ({ children, ...props }) => {
  return (
    <_Navbar color="black" {...props}>
      <NavbarBrand>
        <NavbarItem className={classNames("is-unselectable")}>
          <Logo size={24} />
          <span>
            ggbot<b className={classNames("has-text-brand")}>2</b>
          </span>
        </NavbarItem>
      </NavbarBrand>

      {children}
    </_Navbar>
  );
};
