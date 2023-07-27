import { mount } from "@ggbot2/react";
import { FC } from "react";

import { AccountSettingsPage } from "../pages/AccountSettings.js";
import { BillingSettingsPage } from "../pages/BillingSettings.js";
import { BinanceSettingsPage } from "../pages/BinanceSettings.js";
import { CopyStrategyPage } from "../pages/CopyStrategy.js";
import { DashboardPage } from "../pages/Dashboard.js";
import { StrategyPage } from "../pages/Strategy.js";
import { SubscriptionCanceledPage } from "../pages/SubscriptionCanceled.js";
import { SubscriptionPurchasedPage } from "../pages/SubscriptionPurchased.js";
import {
  copyStrategyHtmlFilename,
  indexHtmlFilename,
  settingsHtmlFilename,
  strategyHtmlFilename,
  subscriptionCanceledHtmlFilename,
  subscriptionPurchasedHtmlFilename,
} from "./pages.js";

const Router: FC = () => {
  const pathname = window.location.pathname;

  switch (true) {
    case pathname === "/":
    case pathname === `/${indexHtmlFilename}`:
      return <DashboardPage />;

    case pathname === `/${copyStrategyHtmlFilename}`:
      return <CopyStrategyPage />;

    case pathname === `/${strategyHtmlFilename}`:
      return <StrategyPage />;

    case pathname === `/${settingsHtmlFilename("account")}`:
      return <AccountSettingsPage />;

    case pathname === `/${settingsHtmlFilename("billing")}`:
      return <BillingSettingsPage />;

    case pathname === `/${settingsHtmlFilename("binance")}`:
      return <BinanceSettingsPage />;

    case pathname === `/${subscriptionCanceledHtmlFilename}`:
      return <SubscriptionCanceledPage />;

    case pathname === `/${subscriptionPurchasedHtmlFilename}`:
      return <SubscriptionPurchasedPage />;

    default:
      return null;
  }
};

mount(Router);
