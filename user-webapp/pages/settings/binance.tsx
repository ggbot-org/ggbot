import { NextPage } from "next";
import { BinanceSettingsPage } from "_pages/BinanceSettings";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <BinanceSettingsPage />;
};

export default Page;
