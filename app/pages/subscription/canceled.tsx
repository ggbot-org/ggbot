import { NextPage } from "next";
import { SubscriptionCanceledPage } from "_pages/SubscriptionCanceled";
import { requireAuthentication } from "_routing/serverSide";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <SubscriptionCanceledPage />;

export default Page;