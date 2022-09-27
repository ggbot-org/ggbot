import { FC, ReactNode } from "react";

type Props = { children: ReactNode };

export const Main: FC<Props> = ({ children }) => (
  <main className="px-2 min-w-screen min-h-screen flex flex-col">
    {children}
  </main>
);
