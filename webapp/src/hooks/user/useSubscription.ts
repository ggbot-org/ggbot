import { AuthenticationContext } from "_/contexts/Authentication"
import {
	shouldPurchaseSubscription,
	statusOfSubscription,
	SubscriptionPlan,
	SubscriptionStatus
} from "@workspace/models"
import { dayToTime, Time } from "minimal-time-helpers"
import { useContext } from "react"

type UseSubscriptionOutput = Partial<{
	canPurchaseSubscription: boolean
	hasActiveSubscription: boolean
	subscriptionEnd: Time
	subscriptionStatus: SubscriptionStatus
	subscriptionPlan: SubscriptionPlan
	isPro: boolean
}>

export function useSubscription(): UseSubscriptionOutput {
	const { subscription } = useContext(AuthenticationContext)

	if (subscription === undefined) return {}
	if (subscription === null) return {
		canPurchaseSubscription: true,
		hasActiveSubscription: false
	}
	const subscriptionStatus = statusOfSubscription(subscription)
	return {
		canPurchaseSubscription: shouldPurchaseSubscription(subscription),
		hasActiveSubscription: subscriptionStatus === "active",
		subscriptionEnd: dayToTime(subscription.end),
		subscriptionStatus,
		subscriptionPlan: subscription.plan,
		isPro: subscription.plan === "pro"
	}
}
