import { readSession } from "@ggbot2/cookies";
import { GetServerSideProps, NextPage } from "next";
import { AuthEnterPage } from "_pages/AuthEnter";
import { AuthExitPage } from "_pages/AuthExit";
import { HasSession } from "_routing";

type ServerSideProps = HasSession;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = readSession(req.cookies);
  return {
    props: {
      hasSession: session !== undefined,
    },
  };
};

const Page: NextPage<ServerSideProps> = ({ hasSession }) => {
  return hasSession ? <AuthExitPage /> : <AuthEnterPage />;
};

export default Page;
