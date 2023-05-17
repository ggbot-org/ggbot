import { CopyStrategyPage } from "_pages/CopyStrategy";
import { requireAuthenticationAndGetStrategyInfo } from "_routing/serverSide";
import { StrategyInfo } from "_routing/types";
import { NextPage } from "next";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = (props) => (
  <CopyStrategyPage {...props} />
);

export default Page;
