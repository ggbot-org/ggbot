import { NextPage } from "next";
import { Navigation, Page } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const ThankyouPage: NextPage = () => {
  return <Page topbar={<Navigation />}>Thank you for your purchase.</Page>;
};

export default ThankyouPage;
