import { NextPage } from "next";
import { requireAuthentication } from "_routing";
import { CreateStrategy } from "_screens";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <CreateStrategy />;
};

export default Page;
