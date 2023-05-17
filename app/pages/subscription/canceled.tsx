import { SubscriptionCanceledPage } from "_pages/SubscriptionCanceled";
import { requireAuthentication } from "_routing/serverSide";
import { NextPage } from "next";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <SubscriptionCanceledPage />;

export default Page;
