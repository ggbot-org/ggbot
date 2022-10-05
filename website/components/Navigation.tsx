import { Header, Logo } from "@ggbot2/ui-components";
import Link from "next/link";
import { FC } from "react";

export const Navigation: FC = () => {
  return (
    <Header>
      <div className="flex flex-row justify-between">
        <Link href="/">
          <div className="flex w-fit flex-row items-center gap-1 px-1 cursor-pointer">
            <Logo size={24} />
            <span>
              ggbot<b className="text-primary-brand">2</b>
            </span>
          </div>
        </Link>
      </div>
    </Header>
  );
};
