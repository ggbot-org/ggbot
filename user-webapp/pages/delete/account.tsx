import { NextPage } from "next";
import { DeleteAccount } from "_screens";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <DeleteAccount />;
};

export default Page;
