import { mount } from "@ggbot2/react"
import { FC } from "react"

import {
	AccountSettingsPage,
	BillingSettingsPage,
	BinanceSettingsPage,
	CopyStrategyPage,
	DashboardPage,
	PurchaseCanceledPage,
	StrategyPage,
	SubscriptionPurchasedPage
} from "../../pages/user/index"
import {
	copyStrategyHtmlFilename,
	dashboardHtmlFilename,
	purchaseCanceledHtmlFilename,
	settingsHtmlFilename,
	strategyHtmlFilename,
	subscriptionPurchasedHtmlFilename
} from "./pages"

const Router: FC = () => {
	const pathname = window.location.pathname

	switch (true) {
		case pathname === "/":
		case pathname === `/${dashboardHtmlFilename}`:
			return <DashboardPage />

		case pathname === `/${copyStrategyHtmlFilename}`:
			return <CopyStrategyPage />

		case pathname === `/${strategyHtmlFilename}`:
			return <StrategyPage />

		case pathname === `/${settingsHtmlFilename("account")}`:
			return <AccountSettingsPage />

		case pathname === `/${settingsHtmlFilename("billing")}`:
			return <BillingSettingsPage />

		case pathname === `/${settingsHtmlFilename("binance")}`:
			return <BinanceSettingsPage />

		case pathname === `/${purchaseCanceledHtmlFilename}`:
			return <PurchaseCanceledPage />

		case pathname === `/${subscriptionPurchasedHtmlFilename}`:
			return <SubscriptionPurchasedPage />

		default:
			return null
	}
}

mount(Router)
