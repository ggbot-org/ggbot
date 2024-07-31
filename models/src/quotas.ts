import { SubscriptionPlan } from "./subscription.js"

const quotaTypes = [
	"MAX_OPERATIONS_HISTORY_DAYS",
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
	/** Operations history includes both strategy orders and errors. */
	MAX_OPERATIONS_HISTORY_DAYS: (plan) => {
		if (plan === "basic") return 180
		if (plan === "pro") return 180
		return 180
	},
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
