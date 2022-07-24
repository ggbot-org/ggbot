import type { GetServerSideProps, NextPage } from "next";
import { Page, Strategies } from "_components";
import { readSession, redirectToAuthenticationPage } from "_routing";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = readSession(req.cookies);
  if (!session) return redirectToAuthenticationPage();

  return {
    props: {},
  };
};

const HomePage: NextPage = () => {
  return (
    <Page>
      <Strategies />
    </Page>
  );
};

export default HomePage;
