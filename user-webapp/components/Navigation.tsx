import {
  Logo,
  Navbar,
  NavbarBrand,
  NavbarDropdown,
  NavbarItem,
  NavbarItemAnchor,
  NavbarLink,
  NavbarMenu,
  NavbarProps,
  NavbarStart,
  classNames,
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

  const goToDashboard = useCallback(() => {
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
      // if (router.pathname !== route.settingsPage())
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
    <Navbar color="black" isFixedTop onClick={toggleMenu}>
      <NavbarBrand>
        <NavbarItem className={classNames("is-unselectable")}>
          <Logo size={24} />
          <em>
            ggbot<b className={classNames("has-text-brand")}>2</b>
          </em>
        </NavbarItem>
      </NavbarBrand>

      {!noMenu && (
        <NavbarMenu isActive={menuIsActive}>
          <NavbarStart>
            <NavbarItemAnchor onClick={goToDashboard}>Dashboard</NavbarItemAnchor>

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
        </NavbarMenu>
      )}
    </Navbar>
  );
});

Navigation.displayName = "Navigation";
