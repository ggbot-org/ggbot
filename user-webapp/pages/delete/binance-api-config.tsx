import { NextPage } from "next";
import { DeleteBinanceApiConfig } from "_screens";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <DeleteBinanceApiConfig />;
};

export default Page;
