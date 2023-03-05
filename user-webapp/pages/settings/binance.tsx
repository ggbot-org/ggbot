import { NextPage } from "next";
import { SettingsBinancePage } from "_pages";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <SettingsBinancePage />;
};

export default Page;
