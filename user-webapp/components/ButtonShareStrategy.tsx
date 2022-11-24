import type { StrategyKey } from "@ggbot2/models";
import { Button, ButtonOnClick } from "@ggbot2/ui-components";
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
      if (canShare) {
        _navigator?.clipboard.writeText(url);
        toast("Strategy link copied");
      } else {
        toast.error("Please copy URL manually");
      }
    } catch (_ignore) {}
  }, [_navigator, canShare, url]);

  const onClick = useCallback<ButtonOnClick>(async () => {
    try {
      if (_navigator.canShare({ url })) _navigator.share({ url });
      else copyToClipboard();
    } catch (_ignore) {
      copyToClipboard();
    }
  }, [_navigator, copyToClipboard, url]);

  return <Button onClick={onClick}>share</Button>;
};
