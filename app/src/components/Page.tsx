import { FC, PropsWithChildren } from "react";

import { Navigation, NavigationProps } from "../components/Navigation.js";
import { NoNetwork } from "../components/NoNetwork.js";

export type PageProps = Pick<NavigationProps, "noMenu">;

export const Page: FC<PropsWithChildren<PageProps>> = ({
  children,
  noMenu,
}) => (
  <>
    <Navigation noMenu={noMenu} />

    <NoNetwork />

    {children}
  </>
);
