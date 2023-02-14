import { FC, ReactNode } from "react";

type Props = { children: ReactNode };

export const Header: FC<Props> = ({ children }) => {
  return (
    <header className="w-full select-none bg-black text-white">
      {children}
    </header>
  );
};
