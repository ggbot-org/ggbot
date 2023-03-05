import { NextPage } from "next";
import { DeleteAccountPage } from "_pages";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <DeleteAccountPage />;
};

export default Page;
