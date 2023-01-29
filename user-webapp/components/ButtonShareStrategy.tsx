import { StrategyKey } from "@ggbot2/models";
import { Button, ButtonOnClick } from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { route, webappBaseUrl } from "_routing";

type Props = StrategyKey;

export const ButtonShareStrategy: FC<Props> = (strategyKey) => {
  const shareData = useMemo(
    () => ({
      title: "ggbot2",
      text: `strategy ${strategyKey.strategyId}`,
      url: `${webappBaseUrl}${route.viewFlowPage(strategyKey)}`,
    }),
    [strategyKey]
  );

  const onClick = useCallback<ButtonOnClick>(async () => {
    try {
      if (!navigator) return;
      if (
        "share" in navigator &&
        "canShare" in navigator &&
        navigator.canShare(shareData)
      ) {
        navigator.share(shareData);
        return;
      }
      if ("clipboard" in navigator) {
        navigator.clipboard.writeText(shareData.url);
        toast("Strategy link copied");
        return;
      }
      throw new Error("Unable to share strategy");
    } catch {
      toast.error("Please copy URL manually");
    }
  }, [shareData]);

  return <Button onClick={onClick}>share</Button>;
};
