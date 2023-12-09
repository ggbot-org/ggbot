import { useUserApi } from "_/hooks/useUserApi"
import { userDB } from "_/storages/userDB"
import {
	shouldPurchaseSubscription,
	statusOfSubscription,
	Subscription,
	SubscriptionPlan,
	SubscriptionStatus
} from "@workspace/models"
import { dayToTime, Time } from "minimal-time-helpers"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

type ContextValue = Partial<{
	canPurchaseSubscription: boolean
	hasActiveSubscription: boolean
	subscriptionEnd: Time
	subscriptionStatus: SubscriptionStatus
	subscriptionPlan: SubscriptionPlan
}>

export const SubscriptionContext = createContext<ContextValue>({})

SubscriptionContext.displayName = "SubscriptionContext"

const subscriptionToContext = (
	subscription: Subscription | null
): ContextValue => {
	if (subscription === null)
		return {
			canPurchaseSubscription: true,
			hasActiveSubscription: false
		}
	const subscriptionStatus = statusOfSubscription(subscription)
	return {
		canPurchaseSubscription: shouldPurchaseSubscription(subscription),
		hasActiveSubscription: subscriptionStatus === "active",
		subscriptionEnd: dayToTime(subscription.end),
		subscriptionStatus,
		subscriptionPlan: subscription.plan
	}
}

export const SubscriptionProvider: FC<PropsWithChildren> = ({ children }) => {
	const READ = useUserApi.ReadSubscription()
	const subscription = READ.data

	const contextValue = useMemo<ContextValue>(() => {
		if (subscription === undefined) {
			const storedSubscription = userDB.subscription
			if (!storedSubscription) return {}
			return subscriptionToContext(storedSubscription)
		}
		if (subscription === null) {
			// TODO userDB.subscription = null
			return {
				canPurchaseSubscription: true,
				hasActiveSubscription: false
			}
		}
		// TODO userDB.subscription = subscription
		return subscriptionToContext(subscription)
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
