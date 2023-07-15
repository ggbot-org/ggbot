import { Button } from "@ggbot2/design";
import { FC, useCallback, useContext } from "react";
import { toast } from "react-hot-toast";

import { StrategyContext } from "../contexts/Strategy.js";
import { buttonLabel, errorMessage } from "../i18n/index.js";
import { href } from "../routing/hrefs.js";

export const ShareStrategyButton: FC = () => {
  const { strategyKey, strategyName } = useContext(StrategyContext);

  const onClick = useCallback(async () => {
    try {
      if (!strategyKey || strategyName) return;
      const shareData = {
        title: "ggbot2",
        text: strategyName,
        url: `${window.location.origin}${href.viewFlowPage(strategyKey)}`,
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
  }, [strategyKey, strategyName]);

  return (
    <Button type="button" onClick={onClick}>
      {buttonLabel.share}
    </Button>
  );
};
