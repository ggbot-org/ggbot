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
import { memo, useCallback, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { AuthenticationContext } from "../contexts/Authentication.js";
import { href } from "../routing/hrefs.js";
import { SettingsPageId } from "../routing/types.js";

export type NavigationProps = Pick<NavbarProps, "noMenu">;

export const Navigation = memo<NavigationProps>(({ noMenu }) => {
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
              <FormattedMessage id="Navigation.strategies" />
            </NavbarItemAnchor>

            <NavbarItem hasDropdown isHoverable>
              <NavbarLink>
                <FormattedMessage id="Navigation.settings" />
              </NavbarLink>

              <NavbarDropdown>
                <NavbarItemAnchor onClick={goToSettings("account")}>
                  <FormattedMessage id="Navigation.account" />
                </NavbarItemAnchor>

                <NavbarItemAnchor onClick={goToSettings("binance")}>
                  <FormattedMessage id="Navigation.binance" />
                </NavbarItemAnchor>

                <NavbarItemAnchor onClick={goToSettings("billing")}>
                  <FormattedMessage id="Navigation.billing" />
                </NavbarItemAnchor>
              </NavbarDropdown>
            </NavbarItem>
          </NavbarStart>

          <NavbarEnd>
            <NavbarItemAnchor onClick={onClickExit}>
              <FormattedMessage id="Navigation.exit" />
            </NavbarItemAnchor>
          </NavbarEnd>
        </>
      )}
    </Navbar>
  );
});

Navigation.displayName = "Navigation";
