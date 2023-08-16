import { SubscriptionPlan } from "./subscription.js"

export const quotaTypes = [
	"NUM_DAYS_TRANSACTIONS_HISTORY",
	"MAX_ORDERS_IN_ORDERS_POOL",
	"MAX_STRATEGIES_PER_ACCOUNT",
	"MAX_SCHEDULINGS_PER_ACCOUNT"
] as const
export type QuotaType = (typeof quotaTypes)[number]
export const quotaType: Record<string, QuotaType> = Object.fromEntries(
	quotaTypes.map((quotaType) => [quotaType, quotaType])
)

export const quota: Record<
	QuotaType,
	(arg: SubscriptionPlan | null | undefined) => number
> = {
	NUM_DAYS_TRANSACTIONS_HISTORY: (plan) => {
		if (plan === "basic") return 365
		return 30
	},
	MAX_ORDERS_IN_ORDERS_POOL: (plan) => {
		if (plan === "basic") return 10
		return 0
	},
	MAX_STRATEGIES_PER_ACCOUNT: (plan) => {
		if (plan === "basic") return 20
		return 2
	},
	MAX_SCHEDULINGS_PER_ACCOUNT: (plan) => {
		if (plan === "basic") return 10
		return 0
	}
}
