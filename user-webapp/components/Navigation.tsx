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
import { useRouter } from "next/router";
import { FC, memo, useCallback } from "react";
import { navigationLabel } from "_i18n";
import { SettingsSectionId, pathname } from "_routing";

type Props = Pick<NavbarProps, "noMenu">;

export const Navigation: FC<Props> = memo(({ noMenu }) => {
  const router = useRouter();

  const goToHomePage = () => {
    if (router.pathname !== pathname.homePage())
      router.push(pathname.homePage());
  };

  const onClickExit = () => {
    if (router.pathname !== pathname.authPage())
      router.push(pathname.authPage());
  };

  const goToSettings = useCallback(
    (section: SettingsSectionId) => () => {
      router.push(pathname.settingsPage(section));
    },
    [router]
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
