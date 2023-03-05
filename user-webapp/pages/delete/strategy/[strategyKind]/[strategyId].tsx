import { NextPage } from "next";
import { StrategyInfo, requireAuthenticationAndGetStrategyInfo } from "_routing";
import { DeleteStrategyPage } from "_pages";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ accountIsOwner, strategyKey, name, whenCreated }) => {
  return (
    <DeleteStrategyPage
      accountIsOwner={accountIsOwner}
      strategyKey={strategyKey}
      name={name}
      whenCreated={whenCreated}
    />
  );
};

export default Page;
