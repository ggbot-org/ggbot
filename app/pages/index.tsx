import { DashboardPage } from "_pages/Dashboard";
import { requireAuthentication } from "_routing/serverSide";
import { NextPage } from "next";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <DashboardPage />;

export default Page;
