import { NextPage } from "next";
import { DashboardPage } from "_pages/Dashboard";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <DashboardPage />;
};

export default Page;
