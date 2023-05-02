import { NextPage } from "next";
import { SubscriptionPurchasedPage } from "_pages/SubscriptionPurchased";
import { requireAuthentication } from "_routing/serverSide";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <SubscriptionPurchasedPage />;

export default Page;
