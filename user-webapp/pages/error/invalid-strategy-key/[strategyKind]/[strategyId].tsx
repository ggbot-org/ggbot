import { readSession } from "@ggbot2/cookies";
import { isStrategyKey } from "@ggbot2/models";
import { GetServerSideProps, NextPage } from "next";
import { Navigation, Page } from "_components";
import { InvalidStrategyKey, redirectToAuthenticationPage, redirectToHomePage } from "_routing";

type ServerSideProps = InvalidStrategyKey;

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const session = readSession(req.cookies);
  if (!session) return redirectToAuthenticationPage();

  const strategyKey = {
    strategyKind: params?.strategyKind?.toString() ?? "undefined",
    strategyId: params?.strategyId?.toString() ?? "undefined",
  };
  if (isStrategyKey(strategyKey)) return redirectToHomePage();
  return {
    props: strategyKey,
  };
};

const InvalidStrategyKeyPage: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
  return (
    <Page topbar={<Navigation />}>
      <div>
        <span>
          Invalid <em>strategy key</em>
        </span>
        <div>
          <dl>
            <dt>kind</dt>
            <dd>{strategyKind}</dd>
            <dt>id</dt>
            <dd>{strategyId}</dd>
          </dl>
        </div>
      </div>
    </Page>
  );
};

export default InvalidStrategyKeyPage;
