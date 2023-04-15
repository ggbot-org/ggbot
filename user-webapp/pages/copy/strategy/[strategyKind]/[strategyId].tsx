import { NextPage } from "next";
import { CopyStrategyPage } from "_pages/CopyStrategy";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = (props) => {
  return <CopyStrategyPage {...props} />;
};

export default Page;
