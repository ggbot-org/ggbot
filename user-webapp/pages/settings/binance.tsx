import { NextPage } from "next";
import { SettingsBinance } from "_screens";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <SettingsBinance />;
};

export default Page;
