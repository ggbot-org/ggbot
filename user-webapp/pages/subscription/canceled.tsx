import { NextPage } from "next";
import { Navigation, Page } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const SubscriptionCanceledPage: NextPage = () => {
  return <Page topbar={<Navigation />}>Your purchase was canceled.</Page>;
};

export default SubscriptionCanceledPage;
