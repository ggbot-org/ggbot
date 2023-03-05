import { NextPage } from "next";
import { requireAuthentication } from "_routing";
import { SubscriptionPurchasedPage } from "_pages";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <SubscriptionPurchasedPage />;
};

export default Page;
