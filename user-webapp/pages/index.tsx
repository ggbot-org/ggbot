import { NextPage } from "next";
import { OneSectionLayout } from "_layouts";
import { DashboardPage } from "_pages/Dashboard";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <OneSectionLayout>
      <DashboardPage />
    </OneSectionLayout>
  );
};

export default Page;
