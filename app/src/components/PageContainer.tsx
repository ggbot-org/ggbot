import { Container, ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC, PropsWithChildren } from "react";

import { Navigation, NavigationProps } from "../components/Navigation.js";
import { NoNetwork } from "../components/NoNetwork.js";

type Props = Pick<NavigationProps, "noMenu">;

export const PageContainer: FC<PropsWithChildren<Props>> = ({
  children,
  noMenu,
}) => (
  <I18nProvider>
    <Navigation noMenu={noMenu} />

    <Container maxWidth="widescreen">
      <NoNetwork />

      <ToastProvider>{children}</ToastProvider>
    </Container>
  </I18nProvider>
);
