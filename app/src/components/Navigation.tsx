import {
  Navbar,
  NavbarDropdown,
  NavbarEnd,
  NavbarItem,
  NavbarItemAnchor,
  NavbarLink,
  NavbarProps,
  NavbarStart,
} from "@ggbot2/design";
import { FC, memo, useCallback } from "react";

import { navigationLabel } from "../i18n/index.js";
import { pathname } from "../routing/pathnames.js";
import { SettingsSectionId } from "../routing/types.js";

type Props = Pick<NavbarProps, "noMenu">;

export const Navigation: FC<Props> = memo(({ noMenu }) => {
  const goToHomePage = () => {
    if (window.location.pathname !== pathname.homePage())
      window.location.pathname = pathname.homePage();
  };

  const onClickExit = () => {
    if (window.location.pathname !== pathname.authPage())
      window.location.pathname = pathname.authPage();
  };

  const goToSettings = useCallback(
    (section: SettingsSectionId) => () => {
      window.location.pathname = pathname.settingsPage(section);
    },
    []
  );

  return (
    <Navbar noMenu={noMenu}>
      {noMenu || (
        <>
          <NavbarStart>
            <NavbarItemAnchor onClick={goToHomePage}>
              {navigationLabel.strategies}
            </NavbarItemAnchor>

            <NavbarItem hasDropdown isHoverable>
              <NavbarLink>{navigationLabel.settings}</NavbarLink>

              <NavbarDropdown>
                <NavbarItemAnchor onClick={goToSettings("account")}>
                  {navigationLabel.account}
                </NavbarItemAnchor>

                <NavbarItemAnchor onClick={goToSettings("binance")}>
                  {navigationLabel.binance}
                </NavbarItemAnchor>

                <NavbarItemAnchor onClick={goToSettings("billing")}>
                  {navigationLabel.billing}
                </NavbarItemAnchor>
              </NavbarDropdown>
            </NavbarItem>
          </NavbarStart>

          <NavbarEnd>
            <NavbarItemAnchor onClick={onClickExit}>
              {navigationLabel.exit}
            </NavbarItemAnchor>
          </NavbarEnd>
        </>
      )}
    </Navbar>
  );
});

Navigation.displayName = "Navigation";
