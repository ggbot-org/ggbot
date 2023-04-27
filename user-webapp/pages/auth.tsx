import { readSession } from "@ggbot2/cookies";
import { GetServerSideProps, NextPage } from "next";
import { AuthEnterPage } from "_pages/AuthEnter";
import { AuthExitPage } from "_pages/AuthExit";
import { HasSessionProp } from "_routing/types";

type ServerSideProps = HasSessionProp;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = readSession(req.cookies);
  return {
    props: {
      hasSession: session !== undefined,
    },
  };
};

const Page: NextPage<ServerSideProps> = ({ hasSession }) =>
  hasSession ? <AuthExitPage /> : <AuthEnterPage />;

export default Page;
