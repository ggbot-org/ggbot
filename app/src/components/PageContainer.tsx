import { Container, ContainerProps, ToastProvider } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";

import { Navigation, NavigationProps } from "../components/Navigation.js";
import { NoNetwork } from "../components/NoNetwork.js";

type Props = Pick<NavigationProps, "noMenu"> & Pick<ContainerProps, "maxWidth">;

export const PageContainer: FC<PropsWithChildren<Props>> = ({
  children,
  maxWidth,
  noMenu,
}) => (
  <>
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
  </>
);
