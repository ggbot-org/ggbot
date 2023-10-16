import { SubscriptionPlan } from "./subscription.js"

const quotaTypes = [
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
	MAX_STRATEGIES_PER_ACCOUNT: (plan) => {
		if (plan === "basic") return 20
		return 2
	},
	MAX_SCHEDULINGS_PER_ACCOUNT: (plan) => {
		if (plan === "basic") return 10
		return 0
	}
}
