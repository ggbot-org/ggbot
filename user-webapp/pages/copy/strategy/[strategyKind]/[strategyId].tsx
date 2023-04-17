import { NextPage } from "next";
import { CopyStrategyPage } from "_pages/CopyStrategy";
import { requireAuthenticationAndGetStrategyInfo } from "_routing/serverSide";
import { StrategyInfo } from "_routing/types";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = (props) => {
  return <CopyStrategyPage {...props} />;
};

export default Page;
