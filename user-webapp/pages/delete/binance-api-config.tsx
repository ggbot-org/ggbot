import { NextPage } from "next";
import { DeleteBinanceApi } from "_screens";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <DeleteBinanceApi />;
};

export default Page;
