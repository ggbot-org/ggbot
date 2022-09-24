import { useRouter } from "next/router";
import { FC, useCallback } from "react";
import { Icon, Navbar, NavbarBrand } from "@ggbot2/ui-components";
import { route } from "_routing";

type Props = {
  /** Show settings icon. */
  hasSettingsIcon?: boolean;
};

export const Navigation: FC<Props> = ({ hasSettingsIcon }) => {
  const router = useRouter();

  const goToHomepage = useCallback(() => {
    if (router.pathname !== route.homePage()) router.push(route.homePage());
  }, [router]);

  const goToSettings = useCallback(() => {
    if (router.pathname !== route.settingsPage())
      router.push(route.settingsPage());
  }, [router]);

  return (
    <Navbar>
      <div className="flex flex-row justify-between">
        <NavbarBrand onClick={goToHomepage} />
        {hasSettingsIcon && (
          <div className="px-1 flex flex-row items-center">
            <Icon name="dots-vertical" onClick={goToSettings} />
          </div>
        )}
      </div>
    </Navbar>
  );
};
