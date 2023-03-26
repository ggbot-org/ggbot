import { Button } from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC } from "react";
import { buttonLabel } from "_i18n";
import { pathname } from "_routing";

export const GoCreateStrategyButton: FC = () => {
  const router = useRouter();

  const onClick = () => {
    if (router.pathname !== pathname.createStrategyPage())
      router.push(pathname.createStrategyPage());
  };

  return <Button onClick={onClick}>{buttonLabel.goToCreateStrategy}</Button>;
};
