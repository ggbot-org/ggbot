import { NextPage } from "next";
import { DeleteBinanceApiConfigPage } from "_pages";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

// TODO remove this page, use a Modal

const Page: NextPage = () => {
  return <DeleteBinanceApiConfigPage />;
};

export default Page;
