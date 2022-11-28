import type { NextPage } from "next";
import { useMemo } from "react";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
  SchedulingsForm,
  StrategyForm,
} from "_components";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ strategyKey, whenCreated }) => {
  const breadcrumbs = useMemo(
    () => [
      {
        content: <NavigationBreadcrumbDashboard isLink />,
      },
      {
        content: <NavigationBreadcrumbStrategy strategyKey={strategyKey} />,
        current: true,
      },
    ],
    [strategyKey]
  );

  return (
    <Content topbar={<Navigation hasSettingsIcon breadcrumbs={breadcrumbs} />}>
      <StrategyForm strategyKey={strategyKey} whenCreated={whenCreated} />
      <SchedulingsForm strategyKey={strategyKey} />
    </Content>
  );
};

export default Page;
