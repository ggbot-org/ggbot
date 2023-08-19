import {
	isSubscription,
	shouldPurchaseSubscription,
	statusOfSubscription,
	SubscriptionPlan,
	SubscriptionStatus
} from "@ggbot2/models"
import { dayToTime, Time } from "minimal-time-helpers"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

import { useUserApi } from "../../hooks/useUserApi.js"

type ContextValue = Partial<{
	canPurchaseSubscription: boolean
	hasActiveSubscription: boolean
	subscriptionEnd: Time
	subscriptionStatus: SubscriptionStatus
	subscriptionPlan: SubscriptionPlan
}>

export const SubscriptionContext = createContext<ContextValue>({})

SubscriptionContext.displayName = "SubscriptionContext"

export const SubscriptionProvider: FC<PropsWithChildren> = ({ children }) => {
	const READ = useUserApi.ReadSubscription()
	const subscription = READ.data

	const contextValue = useMemo(() => {
		if (subscription === null)
			return {
				canPurchaseSubscription: true,
				hasActiveSubscription: false
			}
		if (!isSubscription(subscription)) return {}
		const subscriptionStatus = statusOfSubscription(subscription)
		return {
			canPurchaseSubscription: shouldPurchaseSubscription(subscription),
			hasActiveSubscription: subscriptionStatus === "active",
			subscriptionEnd: dayToTime(subscription.end),
			subscriptionStatus,
			subscriptionPlan: subscription.plan
		}
	}, [subscription])

	useEffect(() => {
		if (READ.canRun) READ.request()
	}, [READ])

	return (
		<SubscriptionContext.Provider value={contextValue}>
			{children}
		</SubscriptionContext.Provider>
	)
}
