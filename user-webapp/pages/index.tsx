import { NextPage } from "next";
import { Navigation, Page, Strategies } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const HomePage: NextPage = () => {
  return (
    <Page topbar={<Navigation />}>
      <Strategies />
    </Page>
  );
};

export default HomePage;
