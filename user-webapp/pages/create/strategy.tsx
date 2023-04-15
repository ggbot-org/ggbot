import { NextPage } from "next";
import { requireAuthentication } from "_routing";
import { CreateStrategyPage } from "_pages/CreateStrategy";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <CreateStrategyPage />;
};

export default Page;
