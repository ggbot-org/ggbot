import {
  Navbar,
  NavbarDropdown,
  NavbarEnd,
  NavbarItem,
  NavbarItemAnchor,
  NavbarLink,
  NavbarMenu,
  NavbarProps,
  NavbarStart,
} from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { SettingsSectionId, route } from "_routing";

type Props = {
  noMenu?: boolean;
};

export const Navigation: FC<Props> = memo(({ noMenu }) => {
  const router = useRouter();
  const [menuIsActive, setMenuIsActive] = useState(false);

  const toggleMenu = useCallback<Exclude<NavbarProps["onClick"], undefined>>((event) => {
    event.stopPropagation();
    setMenuIsActive((active) => !active);
  }, []);

  const goToHomePage = useCallback(() => {
    if (router.pathname !== route.homePage()) router.push(route.homePage());
  }, [router]);

  const goToExit = useCallback(() => {
    if (router.pathname !== route.authPage()) router.push(route.authPage());
  }, [router]);

  const goToCreateStrategy = useCallback(() => {
    if (router.pathname !== route.createStrategyPage()) router.push(route.createStrategyPage());
  }, [router]);

  const goToSettings = useCallback(
    (section: SettingsSectionId) => () => {
      router.push(route.settingsPage(section));
    },
    [router]
  );

  // Close menu on outside click.
  useEffect(() => {
    const closeMenu = () => {
      setMenuIsActive(false);
    };
    window.addEventListener("click", closeMenu);
    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <Navbar onClick={toggleMenu}>
      {!noMenu && (
        <NavbarMenu isActive={menuIsActive}>
          <NavbarStart>
            <NavbarItemAnchor onClick={goToHomePage}>Strategies</NavbarItemAnchor>

            <NavbarItem hasDropdown isHoverable>
              <NavbarLink>Settings</NavbarLink>
              <NavbarDropdown>
                <NavbarItemAnchor onClick={goToSettings("account")}>Account</NavbarItemAnchor>

                <NavbarItemAnchor onClick={goToSettings("binance")}>Binance</NavbarItemAnchor>

                <NavbarItemAnchor onClick={goToSettings("billing")}>Billing</NavbarItemAnchor>
              </NavbarDropdown>
            </NavbarItem>

            <NavbarItem hasDropdown isHoverable>
              <NavbarLink>Action</NavbarLink>
              <NavbarDropdown>
                <NavbarItemAnchor onClick={goToCreateStrategy}>New Strategy</NavbarItemAnchor>

                <NavbarItemAnchor onClick={goToExit}>Exit</NavbarItemAnchor>
              </NavbarDropdown>
            </NavbarItem>
          </NavbarStart>

          <NavbarEnd>
            <NavbarItemAnchor onClick={goToExit}>Exit</NavbarItemAnchor>
          </NavbarEnd>
        </NavbarMenu>
      )}
    </Navbar>
  );
});

Navigation.displayName = "Navigation";
