import { NextPage } from "next";
import { CopyStrategyScreen } from "_screens";
import { StrategyInfo, requireAuthenticationAndGetStrategyInfo } from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = (props) => {
  return <CopyStrategyScreen {...props} />;
};

export default Page;
