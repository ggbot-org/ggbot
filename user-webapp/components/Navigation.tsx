import { useRouter } from "next/router";
import { FC, PointerEventHandler, useCallback, useMemo } from "react";
import {
  Icon,
  Navbar,
  NavbarBrand,
  NavbarBreadcrumbs,
  NavbarBreadcrumbsProps,
} from "@ggbot2/ui-components";
import { StrategyKey, route } from "_routing";

type NavigationBreadcrumbs = NavbarBreadcrumbsProps["items"];

type NavigationProps = {
  /** Optionally define navigation */
  breadcrumbs?: NavigationBreadcrumbs;
  /** Show settings icon. */
  hasSettingsIcon?: boolean;
};

export const Navigation: FC<NavigationProps> = ({
  breadcrumbs,
  hasSettingsIcon,
}) => {
  const navigation = useMemo<NavigationBreadcrumbs | undefined>(() => {
    // Fallback to tagline.
    if (!breadcrumbs)
      return [<NavigationBreadcrumbLabel key={1} italic text="crypto flow" />];

    return breadcrumbs.reduce<NavigationBreadcrumbs>((result, item, index) => {
      const isFirst = index === 0;
      if (isFirst) return [...result, item];
      return [...result, <NavigationBreadcrumbSeparator key={index} />, item];
    }, []);
  }, [breadcrumbs]);

  return (
    <Navbar>
      <div className="flex flex-row justify-between">
        <NavbarBrand />
        {navigation && (
          <div className="ml-4 grow">
            <NavbarBreadcrumbs items={navigation} />
          </div>
        )}
        <div className="px-1 flex flex-row items-center">
          {hasSettingsIcon && <NavigationSettingsIcon />}
        </div>
      </div>
    </Navbar>
  );
};

const NavigationSettingsIcon: FC = () => {
  const router = useRouter();
  const goToSettings = useCallback(() => {
    if (router.pathname !== route.settingsPage())
      router.push(route.settingsPage());
  }, [router]);
  return <Icon name="dots-vertical" onClick={goToSettings} />;
};

const NavigationBreadcrumbSeparator: FC = () => (
  <Icon name="caret-right" size={10} />
);

type NavigationBreadcrumbItemProps = {
  isLink?: boolean;
};

const itemClassName = ({ isLink }: NavigationBreadcrumbItemProps) =>
  [isLink ? "cursor-pointer hover:text-primary-200" : ""].join(" ");

type NavigationBreadcrumbLabelProps = { text: string; italic?: boolean };

export const NavigationBreadcrumbLabel: FC<NavigationBreadcrumbLabelProps> = ({
  italic,
  text,
}) => {
  const className = useMemo(
    () => ["text-xs leading-8", italic ? "italic" : ""].join(" "),
    [italic]
  );
  return <span className={className}>{text}</span>;
};

export const NavigationBreadcrumbDashboard: FC<
  NavigationBreadcrumbItemProps
> = ({ isLink }) => {
  const router = useRouter();
  const className = useMemo(() => itemClassName({ isLink }), [isLink]);
  const onClick = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      event.stopPropagation();
      if (!isLink) return;
      if (router.pathname !== route.homePage()) router.push(route.homePage());
    },
    [isLink, router]
  );
  return (
    <div className={className} onClick={onClick}>
      <NavigationBreadcrumbLabel text="dashboard" />
    </div>
  );
};

type NavigationBreadcrumbStrategyProps = {
  strategyKey: StrategyKey;
} & NavigationBreadcrumbItemProps;

export const NavigationBreadcrumbStrategy: FC<
  NavigationBreadcrumbStrategyProps
> = ({ isLink, strategyKey }) => {
  const router = useRouter();
  const { strategyId } = strategyKey;
  const id = useMemo(() => strategyId.split("-").shift() ?? "", [strategyId]);
  const className = useMemo(
    () =>
      ["flex flex-row items-center gap-2", itemClassName({ isLink })].join(" "),
    [isLink]
  );
  const onClick = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      event.stopPropagation();
      if (!isLink) return;
      if (router.pathname !== route.strategyPage(strategyKey))
        router.push(route.strategyPage(strategyKey));
    },
    [isLink, router, strategyKey]
  );
  return (
    <div className={className} onClick={onClick}>
      <NavigationBreadcrumbLabel text="strategy" />
      <NavigationBreadcrumbLabel text={id} />
    </div>
  );
};
