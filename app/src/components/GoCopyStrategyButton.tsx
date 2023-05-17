import { buttonLabel } from "_i18n";
import { pathname } from "_routing/pathnames";
import { StrategyInfo } from "_routing/types";
import { Button, ButtonOnClick } from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useState } from "react";

type Props = Pick<StrategyInfo, "strategyKey">;

export const GoCopyStrategyButton: FC<Props> = ({ strategyKey }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onClick: ButtonOnClick = (event) => {
    event.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);
    router.push(pathname.copyStrategyPage(strategyKey));
  };

  return (
    <Button type="button" isLoading={isLoading} onClick={onClick}>
      {buttonLabel.copy}
    </Button>
  );
};
