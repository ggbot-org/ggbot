import { mount } from "_/react/mount"
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
} from "../../pages/user/index.js"
import {
	copyStrategyHtmlPathname,
	purchaseCanceledHtmlPathname,
	settingsHtmlPathname,
	strategyHtmlPathname,
	subscriptionPurchasedHtmlPathname,
	userDashboardHtmlPathname
} from "./pages.js"

const Router: FC = () => {
	const pathname = window.location.pathname

	switch (true) {
		case pathname === userDashboardHtmlPathname:
			return <DashboardPage />

		case pathname === copyStrategyHtmlPathname:
			return <CopyStrategyPage />

		case pathname === strategyHtmlPathname:
			return <StrategyPage />

		case pathname === settingsHtmlPathname("account"):
			return <AccountSettingsPage />

		case pathname === settingsHtmlPathname("billing"):
			return <BillingSettingsPage />

		case pathname === settingsHtmlPathname("binance"):
			return <BinanceSettingsPage />

		case pathname === purchaseCanceledHtmlPathname:
			return <PurchaseCanceledPage />

		case pathname === subscriptionPurchasedHtmlPathname:
			return <SubscriptionPurchasedPage />

		default:
			return null
	}
}

mount(Router)