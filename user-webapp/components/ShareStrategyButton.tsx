"use client";
import { Button } from "@ggbot2/design";
import { FC } from "react";
import { toast } from "react-hot-toast";
import { buttonLabel, errorMessage } from "_i18n";
import { StrategyInfo, pathname } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey">;

export const ShareStrategyButton: FC<Props> = ({ strategyKey }) => {
  const onClick = async () => {
    try {
      const shareData = {
        title: "ggbot2",
        text: `strategy ${strategyKey.strategyId}`,
        url: `${window.location.origin}/${pathname.viewFlowPage(strategyKey)}`,
      };
      if (
        "share" in navigator &&
        "canShare" in navigator &&
        navigator.canShare(shareData)
      ) {
        navigator.share(shareData);
      } else if ("clipboard" in navigator) {
        navigator.clipboard.writeText(shareData.url);
        toast("Strategy link copied");
      } else {
        throw new Error("Could not share strategy");
      }
    } catch {
      toast.error(errorMessage.couldNotShareStrategy);
    }
  };

  return <Button onClick={onClick}>{buttonLabel.share}</Button>;
};
