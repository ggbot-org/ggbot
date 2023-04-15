import { NextPage } from "next";
import { requireAuthentication } from "_routing";
import { SubscriptionCanceledPage } from "_pages/SubscriptionCanceled";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <SubscriptionCanceledPage />;
};

export default Page;
