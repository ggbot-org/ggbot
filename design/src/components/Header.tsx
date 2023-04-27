import { FC, ReactNode } from "react";

type Props = { children: ReactNode };

export const Header: FC<Props> = ({ children }) => (
  <header className="w-full select-none bg-black text-white">{children}</header>
);
