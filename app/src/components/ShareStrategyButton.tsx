"use client";
import { buttonLabel, errorMessage } from "_i18n";
import { pathname } from "_routing/pathnames";
import { StrategyInfo } from "_routing/types";
import { Button } from "@ggbot2/design";
import { FC } from "react";
import { toast } from "react-hot-toast";

type Props = Pick<StrategyInfo, "strategyKey"> & {
  strategyName: string;
};

export const ShareStrategyButton: FC<Props> = ({
  strategyKey,
  strategyName,
}) => {
  const onClick = async () => {
    try {
      const shareData = {
        title: "ggbot2",
        text: strategyName,
        url: `${window.location.origin}${pathname.viewFlowPage(strategyKey)}`,
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

  return (
    <Button type="button" onClick={onClick}>
      {buttonLabel.share}
    </Button>
  );
};
