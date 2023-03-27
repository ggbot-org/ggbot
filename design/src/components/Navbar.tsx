import {
  FC,
  PointerEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Navbar as _Navbar,
  NavbarBrand,
  NavbarBurger,
  NavbarItem,
  NavbarMenu,
} from "trunx";
import { Logo } from "./Logo";
import { classNames } from "../classNames";

export type NavbarProps = Partial<{
  noMenu: boolean;
}>;

export const Navbar: FC<PropsWithChildren<NavbarProps>> = ({
  children,
  noMenu,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);

  // TODO import NavbarBurgerOnClick from trunx
  const onClickBurger = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      event.stopPropagation();
      setExpanded((expanded) => !expanded);
    },
    []
  );

  // Close menu on outside click.
  useEffect(() => {
    const closeMenu = () => {
      setExpanded(false);
    };
    window.addEventListener("click", closeMenu);
    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <_Navbar color="black" {...props}>
      <NavbarBrand>
        <NavbarItem className={classNames("is-unselectable")}>
          <Logo size={34} />
          <span className={classNames("is-size-5", "has-text-weight-medium")}>
            ggbot<b className={classNames("has-text-brand")}>2</b>
          </span>
        </NavbarItem>

        {noMenu || <NavbarBurger isActive={expanded} onClick={onClickBurger} />}
      </NavbarBrand>

      {noMenu || <NavbarMenu isActive={expanded}>{children}</NavbarMenu>}
    </_Navbar>
  );
};
