import { NextPage } from "next";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationSettingsIcon,
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
          icon={<NavigationSettingsIcon />}
        />
      }
    >
      <Strategies />
    </Content>
  );
};

export default Page;
