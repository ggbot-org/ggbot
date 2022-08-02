import { Button, DateTime } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SyntheticEvent, useCallback } from "react";
import { Content } from "_components";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
  route,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ name, strategyKey }) => {
  const router = useRouter();

  const onClickManage = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      router.push(route.strategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  return (
    <Content>
      <div className="flex flex-col gap-4 p-4">
        <span className="text-xl">edit strategy</span>
        <dl>
          <dt>name</dt>
          <dd>{name}</dd>
        </dl>
        <menu className="flex flex-row gap-4">
          <Button onClick={onClickManage}>manage</Button>
        </menu>
      </div>
    </Content>
  );
};

export default Page;
