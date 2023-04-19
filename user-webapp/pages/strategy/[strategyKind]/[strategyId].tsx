import { NextPage } from "next";
import { ManageStrategyPage } from "_pages/ManageStrategy";
import { requireAuthenticationAndGetStrategyInfo } from "_routing/serverSide";
import { StrategyInfo } from "_routing/types";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({
  strategyKey,
  whenCreated,
  name,
}) => (
    <ManageStrategyPage
      strategyKey={strategyKey}
      whenCreated={whenCreated}
      name={name}
    />
  );

export default Page;
