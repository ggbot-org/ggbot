import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, SyntheticEvent, useCallback } from "react";
import { toast } from "react-hot-toast";
import { StrategyKey, route, webappBaseUrl } from "_routing";

type Props = StrategyKey;

export const ButtonShareStrategy: FC<Props> = (strategyKey) => {
  const router = useRouter();

  const onClick = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      const sharableLink = `${webappBaseUrl}/${route.viewFlowPage(
        strategyKey
      )}`;
      navigator.clipboard.writeText(sharableLink);
      toast("Link copied");
    },
    [router, strategyKey]
  );

  return <Button onClick={onClick}>share</Button>;
};
