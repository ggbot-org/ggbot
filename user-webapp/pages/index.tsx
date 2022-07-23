import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Navigation } from "_components";
import { hasValidSessionCookie, redirectToAuthenticationPage } from "_routing";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const hasSession = hasValidSessionCookie(req.cookies);
  if (!hasSession) return redirectToAuthenticationPage();

  return {
    props: {},
  };
};

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>ggbot2</title>
        <meta name="description" content="crypto flow" />
      </Head>

      <Navigation />
    </>
  );
};

export default Page;
