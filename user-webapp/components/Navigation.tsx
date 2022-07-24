import { FC } from "react";
import { Logo } from "@ggbot2/ui-components";

export const Navigation: FC = () => {
  return (
    <header className="fixed top-0 w-full bg-black text-white select-none">
      <div className="flex flex-row items-center gap-1 px-1">
        <Logo size={24} />
        <span className="leading-7">
          ggbot<b className="text-primary-brand">2</b>
        </span>
      </div>
    </header>
  );
};
