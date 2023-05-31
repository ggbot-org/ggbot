import { navigationLabel } from "_i18n";
import { pathname } from "_routing/pathnames";
import { SettingsSectionId } from "_routing/types";
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
