import type { NextPage } from "next";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationSettingsIcon,
} from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <Content
      topbar={
        <Navigation
          breadcrumbs={[{ content: <NavigationBreadcrumbDashboard isLink /> }]}
          icon={<NavigationSettingsIcon />}
        />
      }
    >
      Thank you for your purchase.
    </Content>
  );
};

export default Page;
