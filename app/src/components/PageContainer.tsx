import { Container, ContainerProps, ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC, PropsWithChildren } from "react";

import { Navigation, NavigationProps } from "../components/Navigation.js";
import { NoNetwork } from "../components/NoNetwork.js";

type Props = Pick<NavigationProps, "noMenu"> & Pick<ContainerProps, "maxWidth">;

export const PageContainer: FC<PropsWithChildren<Props>> = ({
  children,
  maxWidth,
  noMenu,
}) => (
  <I18nProvider>
    <Navigation noMenu={noMenu} />

    {maxWidth ? (
      <Container maxWidth={maxWidth}>
        <NoNetwork />

        <ToastProvider>{children}</ToastProvider>
      </Container>
    ) : (
      <>
        <NoNetwork />

        <ToastProvider>{children}</ToastProvider>
      </>
    )}
  </I18nProvider>
);
