import type { NextPage } from "next";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  Strategies,
} from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <Content
      topbar={
        <Navigation
          breadcrumbs={[{ content: <NavigationBreadcrumbDashboard /> }]}
          hasSettingsIcon
        />
      }
    >
      <Strategies />
    </Content>
  );
};

export default Page;
