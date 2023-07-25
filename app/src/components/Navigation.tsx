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
import { FC, memo, useCallback, useContext } from "react";

import { AuthenticationContext } from "../contexts/Authentication.js";
import { navigationLabel } from "../i18n/index.js";
import { href } from "../routing/hrefs.js";
import { SettingsPageId } from "../routing/types.js";

export type NavigationProps = Pick<NavbarProps, "noMenu">;

export const Navigation: FC<NavigationProps> = memo(({ noMenu }) => {
  const { openExitModal } = useContext(AuthenticationContext);

  const goToHomePage = () => {
    if (window.location.href !== href.homePage())
      window.location.href = href.homePage();
  };

  const onClickExit = useCallback(() => {
    openExitModal();
  }, [openExitModal]);

  const goToSettings = useCallback(
    (settingsPage: SettingsPageId) => () => {
      window.location.href = href.settingsPage(settingsPage);
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
