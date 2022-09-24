import { FC, MouseEventHandler, ReactNode } from "react";
import { Logo } from "./Logo";

type NavbarProps = { children?: ReactNode };

export const Navbar: FC<NavbarProps> = ({ children }) => {
  return (
    <header className="w-full select-none bg-black text-white">
      {children}
    </header>
  );
};

type NavbarBrandProps = {
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export const NavbarBrand: FC<NavbarBrandProps> = ({ onClick }) => {
  return (
    <div
      className="flex w-fit cursor-pointer flex-row items-center gap-1 px-1"
      onClick={onClick}
    >
      <Logo size={24} />
      <span className="leading-7">
        ggbot<b className="text-primary-brand">2</b>
      </span>
    </div>
  );
};
