import { FC, MouseEventHandler, ReactNode, useMemo } from "react";
import { Logo } from "./Logo";

type NavbarProps = { children?: ReactNode };

export const Navbar: FC<NavbarProps> = ({ children }) => {
  return (
    <header className="w-full select-none bg-black text-white">
      {children}
    </header>
  );
};

export type NavbarBreadcrumbsProps = {
  items: ReactNode[];
};

export const NavbarBreadcrumbs: FC<NavbarBreadcrumbsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-row items-center gap-2">
        {items.map((content, index) => (
          <li key={index}>{content}</li>
        ))}
      </ol>
    </nav>
  );
};

export const NavbarBrand: FC = () => (
  <div className="flex w-fit flex-row items-center gap-1 px-1">
    <Logo size={24} />
    <span>
      ggbot<b className="text-primary-brand">2</b>
    </span>
  </div>
);
