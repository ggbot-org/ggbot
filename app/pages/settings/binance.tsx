import { NextPage } from "next";
import { BinanceSettingsPage } from "_pages/BinanceSettings";
import { requireAuthentication } from "_routing/serverSide";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <BinanceSettingsPage />;

export default Page;