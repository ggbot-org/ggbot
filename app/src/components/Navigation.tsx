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
import { FC, memo, useCallback, useState } from "react";

import { AuthExit } from "../components/AuthExit.js";
import { navigationLabel } from "../i18n/index.js";
import { href } from "../routing/hrefs.js";
import { SettingsPageId } from "../routing/types.js";

type Props = Pick<NavbarProps, "noMenu">;

export const Navigation: FC<Props> = memo(({ noMenu }) => {
  const [exitIsActive, setExitIsActive]=useState(false)

  const goToHomePage = () => {
    if (window.location.href !== href.homePage())
      window.location.href = href.homePage();
  };

  const onClickExit = useCallback(() => {
  setExitIsActive(true)
  }, []);

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

        <AuthExit isActive={exitIsActive} setIsActive={setExitIsActive}/>
      </>
      )}
    </Navbar>
  );
});

Navigation.displayName = "Navigation";
