import { Button } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { Content } from "_components";
import {
  StrategyKey,
  requireAuthenticationAndGetStrategyKey,
  useGoBack,
} from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

const Page: NextPage<ServerSideProps> = (/*strategyKey*/) => {
  const goBack = useGoBack();

  return (
    <Content>
      <div className="p-4 flex flex-col gap-4">
        <span className="text-xl">delete strategy</span>
        <div>are you sure you want to delete strategy?</div>
        <menu className="flex flex-row gap-4">
          <Button onClick={goBack}>no, go back</Button>
          <Button color="danger">yes, delete it</Button>
        </menu>
      </div>
    </Content>
  );
};

export default Page;
