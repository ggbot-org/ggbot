import { readSession } from "@ggbot2/cookies";
import { isStrategyKey } from "@ggbot2/models";
import type { GetServerSideProps, NextPage } from "next";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationSettingsIcon,
} from "_components";
import {
  InvalidStrategyKey,
  redirectToAuthenticationPage,
  redirectToHomePage,
} from "_routing";

type ServerSideProps = InvalidStrategyKey;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
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

const Page: NextPage<ServerSideProps> = ({ strategyKind, strategyId }) => {
  return (
    <Content
      topbar={
        <Navigation
          breadcrumbs={[{ content: <NavigationBreadcrumbDashboard isLink /> }]}
          icon={<NavigationSettingsIcon />}
        />
      }
    >
      <div className="p-4 flex flex-col gap-4">
        <span className="text-xl">
          Invalid <em>strategy key</em>
        </span>
        <div className="p-4 shadow">
          <dl>
            <dt>kind</dt>
            <dd>{strategyKind}</dd>
            <dt>id</dt>
            <dd>{strategyId}</dd>
          </dl>
        </div>
      </div>
    </Content>
  );
};

export default Page;
//
