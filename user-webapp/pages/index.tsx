import { NextPage } from "next";
import { DashboardPage } from "_pages/Dashboard";
import { requireAuthentication } from "_routing/serverSide";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <DashboardPage />;

export default Page;
