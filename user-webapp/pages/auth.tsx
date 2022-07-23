import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState, FC, Dispatch, SetStateAction } from "react";
import { Navigation } from "_components";
import { HasSession, hasValidSessionCookie } from "_routing";

type ServerSideProps = HasSession;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const hasSession = hasValidSessionCookie(req.cookies);

  return {
    props: {
      hasSession,
    },
  };
};

const Enter: FC<{ setEmailSent: Dispatch<SetStateAction<boolean>> }> = () => {
  return <div>enter</div>;
};

const Exit: FC = () => {
  return <div>exit</div>;
};

const Verify: FC = () => {
  return <div>verify</div>;
};

const Page: NextPage<ServerSideProps> = ({ hasSession }) => {
  const [emailSent, setEmailSent] = useState(false);

  return (
    <>
      <Head>
        <title>ggbot2</title>
        <meta name="description" content="crypto flow" />
      </Head>

      <Navigation />

      {hasSession ? (
        <Exit />
      ) : (
        <>{emailSent ? <Verify /> : <Enter setEmailSent={setEmailSent} />}</>
      )}
    </>
  );
};

export default Page;
