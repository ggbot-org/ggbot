import { useRouter } from "next/router";
import { FC, useCallback } from "react";
import { Icon, Navbar, NavbarBrand } from "@ggbot2/ui-components";
import { route } from "_routing";

type Props = {
  /** Click on brand links to Homepage */
  brandLinksToHomepage?: boolean;
  /** Show settings icon. */
  hasSettingsIcon?: boolean;
};

export const Navigation: FC<Props> = ({
  brandLinksToHomepage,
  hasSettingsIcon,
}) => {
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
        <NavbarBrand
          onClick={brandLinksToHomepage ? goToHomepage : undefined}
        />
        {hasSettingsIcon && (
          <div className="px-1 flex flex-row items-center">
            <Icon name="dots-vertical" onClick={goToSettings} />
          </div>
        )}
      </div>
    </Navbar>
  );
};
