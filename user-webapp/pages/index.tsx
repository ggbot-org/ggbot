import type { GetServerSideProps, NextPage } from "next";
import { Page, Strategies } from "_components";
import { hasValidSessionCookie, redirectToAuthenticationPage } from "_routing";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const hasSession = hasValidSessionCookie(req.cookies);
  if (!hasSession) return redirectToAuthenticationPage();

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
