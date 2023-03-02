import { NextPage } from "next";
import { requireAuthentication } from "_routing";
import { SubscriptionPurchased } from "_screens";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <SubscriptionPurchased />;
};

export default Page;
