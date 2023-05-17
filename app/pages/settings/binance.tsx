import { BinanceSettingsPage } from "_pages/BinanceSettings";
import { requireAuthentication } from "_routing/serverSide";
import { NextPage } from "next";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <BinanceSettingsPage />;

export default Page;
