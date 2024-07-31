import { SubscriptionPlan } from "./subscription.js"

const quotaTypes = [
	"MAX_STRATEGIES_PER_ACCOUNT",
	"MAX_SCHEDULINGS_PER_ACCOUNT"
] as const
export type QuotaType = (typeof quotaTypes)[number]
export const quotaType: Record<string, QuotaType> = Object.fromEntries(
	quotaTypes.map((quotaType) => [quotaType, quotaType])
)

// TODO add quota for max history, for example ReadStrategyErrors and ReadStrategyOrders can go max to 180 days

export const quota: Record<
	QuotaType,
	(arg: SubscriptionPlan | null | undefined) => number
> = {
	MAX_STRATEGIES_PER_ACCOUNT: (plan) => {
		if (plan === "basic") return 20
		if (plan === "pro") return 50
		return 2
	},
	MAX_SCHEDULINGS_PER_ACCOUNT: (plan) => {
		if (plan === "basic") return 10
		if (plan === "pro") return 30
		return 0
	}
}
