import { NextPage } from "next";
import { SettingsAccount } from "_screens";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <SettingsAccount />;
};

export default Page;
