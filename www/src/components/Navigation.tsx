import { Logo } from "@ggbot2/design";
import { FC } from "react";

export const Navigation: FC = () => (
  <div className="flex flex-row gap-2">
    <a href="/">
      <div className="flex w-fit flex-row items-center gap-1 px-1 cursor-pointer hover:text-cyan-400 transition-all ease-in">
        <Logo size={24} />

        <span>
          ggbot<b className="text-brand">2</b>
        </span>
      </div>
    </a>

    <em className="text-xs leading-8">crypto flow</em>
  </div>
);
