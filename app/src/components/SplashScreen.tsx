import { BrandName, Flex, Logo } from "@ggbot2/design";
import { FC } from "react";

export const splashScreenDuration = 1700;

export const SplashScreen: FC = () => (
  <Flex direction="column" alignItems="center" spacing={{ py: 5 }}>
    <div>
      <Logo animated size={512} />
    </div>

    <div>
      <BrandName size="medium" />
    </div>
  </Flex>
);
