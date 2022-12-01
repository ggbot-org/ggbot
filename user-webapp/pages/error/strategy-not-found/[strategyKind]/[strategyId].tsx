import type { NextPage } from "next";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationSettingsIcon,
} from "_components";
import { StrategyKey, requireAuthenticationAndGetStrategyKey } from "_routing";

type ServerSideProps = StrategyKey;

export const getServerSideProps = requireAuthenticationAndGetStrategyKey;

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
      <div className="flex flex-col gap-4 p-4">
        <span className="text-xl">
          Strategy <em>not found</em>
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
