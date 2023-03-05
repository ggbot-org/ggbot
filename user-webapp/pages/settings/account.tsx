import { NextPage } from "next";
import { SettingsAccountPage } from "_pages";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <SettingsAccountPage />;
};

export default Page;
