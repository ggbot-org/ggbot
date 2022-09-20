import { StrategyKey } from "@ggbot2/models";
import { Button } from "@ggbot2/ui-components";
import { FC, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { route, webappBaseUrl } from "_routing";

type Props = StrategyKey;

// TODO try it on iPhone
export const ButtonShareStrategy: FC<Props> = (strategyKey) => {
  const _navigator = global?.window?.navigator;

  const canShare = useMemo(
    () =>
      _navigator &&
      ("clipboard" in _navigator ||
        ("share" in _navigator && "canShare" in _navigator)),
    [_navigator]
  );

  const url = useMemo(
    () => `${webappBaseUrl}${route.viewFlowPage(strategyKey)}`,
    [strategyKey]
  );

  const copyToClipboard = useCallback(() => {
    try {
      _navigator?.clipboard.writeText(url);
      toast("Strategy link copied");
    } catch (_ignore) {}
  }, [_navigator, url]);

  const onClick = useCallback(async () => {
    try {
      if (_navigator.canShare({ url })) _navigator.share({ url });
      else copyToClipboard();
    } catch (_ignore) {
      copyToClipboard();
    }
  }, [_navigator, copyToClipboard, url]);

  if (!canShare) return null;

  return <Button onClick={onClick}>share</Button>;
};
