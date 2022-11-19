import { useRouter } from "next/router";
import { FC, PointerEventHandler, useCallback, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItems,
  Header,
  Icon,
  Logo,
} from "@ggbot2/ui-components";
import { StrategyKey, route } from "_routing";

type NavigationProps = {
  /** Optionally define navigation. */
  breadcrumbs?: BreadcrumbItems;
  /** Show settings icon. */
  hasSettingsIcon?: boolean;
};

export const Navigation: FC<NavigationProps> = ({
  breadcrumbs,
  hasSettingsIcon,
}) => {
  return (
    <Header>
      <div className="flex flex-row justify-between">
        <div className="flex w-fit flex-row items-center gap-1 px-1">
          <Logo size={24} />
          <span>
            ggbot<b className="text-brand">2</b>
          </span>
        </div>

        <div className="grow">
          {breadcrumbs ? (
            <Breadcrumb items={breadcrumbs} />
          ) : (
            <NavigationLabel italic text="crypto flow" />
          )}
        </div>

        <div className="px-1 flex flex-row items-center">
          {hasSettingsIcon && <NavigationSettingsIcon />}
        </div>
      </div>
    </Header>
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

type NavigationBreadcrumbItemProps = {
  isLink?: boolean;
};

const itemClassName = ({ isLink }: NavigationBreadcrumbItemProps) =>
  [
    "inline-flex items-center transition-all ease-in",
    isLink ? "cursor-pointer hover:text-brand" : "",
  ].join(" ");

type NavigationLabelProps = { text: string; italic?: boolean };

export const NavigationLabel: FC<NavigationLabelProps> = ({ italic, text }) => {
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
      <NavigationLabel text="dashboard" />
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
      <NavigationLabel text="strategy" />
      <NavigationLabel text={id} />
    </div>
  );
};
