import { SubscriptionPurchasedPage } from "_pages/SubscriptionPurchased";
import { requireAuthentication } from "_routing/serverSide";
import { NextPage } from "next";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <SubscriptionPurchasedPage />;

export default Page;
