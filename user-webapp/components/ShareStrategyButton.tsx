"use client";
import { Button } from "@ggbot2/design";
import { StrategyKey } from "@ggbot2/models";
import { FC } from "react";
import { toast } from "react-hot-toast";
import { buttonLabel } from "_i18n";
import { route } from "_routing";

type Props = StrategyKey;

export const ShareStrategyButton: FC<Props> = (strategyKey) => {
  const onClick = async () => {
    try {
      const shareData = {
        title: "ggbot2",
        text: `strategy ${strategyKey.strategyId}`,
        url: `${window.location.origin}/${route.viewFlowPage(strategyKey)}`,
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
        throw new Error("Unable to share strategy");
      }
    } catch {
      toast.error("Please copy URL manually");
    }
  };

  return <Button onClick={onClick}>{buttonLabel.share}</Button>;
};
