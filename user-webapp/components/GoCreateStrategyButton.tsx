import { Button } from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC } from "react";
import { buttonLabel } from "_i18n";
import { route } from "_routing";

export const GoCreateStrategyButton: FC = () => {
  const router = useRouter();

  const onClick = () => {
    if (router.pathname !== route.createStrategyPage())
      router.push(route.createStrategyPage());
  };

  return <Button onClick={onClick}>{buttonLabel.goToCreateStrategy}</Button>;
};
