import { FC } from "react";
import { Breadcrumb, Logo, Header } from "../src";

export const Navigation: FC = () => {
  return (
    <Header>
      <div className="flex flex-row justify-between">
        <div className="flex w-fit flex-row items-center gap-1 px-1">
          <Logo size={24} />
          <span>
            ggbot<b className="text-primary-brand">2</b>
          </span>
        </div>

        <div className="grow">
          <Breadcrumb
            items={[
              { content: <span>page1</span> },
              { content: <span>page2</span>, current: true },
            ]}
          />
        </div>
      </div>
    </Header>
  );
};
