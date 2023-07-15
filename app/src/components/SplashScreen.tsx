import { Flex, Logo } from "@ggbot2/design";
import { FC } from "react";

import { classNames } from "../styles/classNames.js";

export const splashScreenDuration = 1700;

export const SplashScreen: FC = () => (
  <Flex direction="column" alignItems="center" spacing={{ py: 5 }}>
    <div>
      <Logo animated size={512} />
    </div>

    <div>
      <span className={classNames("is-size-3", "has-text-weight-medium")}>
        ggbot<b className={classNames("has-text-primary")}>2</b>
      </span>
    </div>
  </Flex>
);
