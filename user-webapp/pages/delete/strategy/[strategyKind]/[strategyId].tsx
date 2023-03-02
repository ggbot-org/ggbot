import { NextPage } from "next";
import { StrategyInfo, requireAuthenticationAndGetStrategyInfo } from "_routing";
import { DeleteStrategy } from "_screens";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ accountIsOwner, strategyKey, name, whenCreated }) => {
  return (
    <DeleteStrategy
      accountIsOwner={accountIsOwner}
      strategyKey={strategyKey}
      name={name}
      whenCreated={whenCreated}
    />
  );
};

export default Page;
