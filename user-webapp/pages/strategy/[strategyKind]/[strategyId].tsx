import { NextPage } from "next";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
} from "_routing";
import { ManageStrategyPage } from "_pages/ManageStrategy";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({
  strategyKey,
  whenCreated,
  name,
}) => {
  return (
    <ManageStrategyPage
      strategyKey={strategyKey}
      whenCreated={whenCreated}
      name={name}
    />
  );
};

export default Page;
