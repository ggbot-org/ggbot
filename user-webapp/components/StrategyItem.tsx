import Link from "next/link";
import { FC, ReactNode, useMemo } from "react";
import { StrategyKey, route } from "_routing";

type Props = { children: ReactNode; strategyKey: StrategyKey };

export const StrategyItem: FC<Props> = ({ children, strategyKey }) => {
  const strategyHref = useMemo(
    () => route.strategyPage(strategyKey),
    [strategyKey]
  );

  return (
    <Link href={strategyHref} passHref tabIndex={0}>
      <div className="w-full inline-flex gap-4 items-center justify-between select-none cursor-pointer rounded p-2 outline-0 ring-0 ring-mono-400 focus:ring hover:ring-2 active:ring active:ring-primary-400 transition-all ease-in-out">
        {children}
      </div>
    </Link>
  );
};
