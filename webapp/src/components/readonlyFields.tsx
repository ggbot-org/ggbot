import { ReadonlyField } from "_/components/library"
import { dayFormat } from "_/i18n/formats"
import { SubscriptionPlan as SubscriptionPlanValue } from "@workspace/models"
import { Time } from "minimal-time-helpers"
import { useIntl } from "react-intl"

type ValueProp<T> = {
	value: T | undefined
}

export function AccountId({ value }: ValueProp<string>) {
	const { formatMessage } = useIntl()
	return (
		<ReadonlyField
			label={formatMessage({ id: "AccountId.label" })}
			value={value}
		/>
	)
}

export function StrategyId({ value }: ValueProp<string>) {
	const { formatMessage } = useIntl()
	return (
		<ReadonlyField
			label={formatMessage({ id: "StrategyId.label" })}
			value={value}
		/>
	)
}

export function StrategyKind({ value }: ValueProp<string>) {
	const { formatMessage } = useIntl()
	return (
		<ReadonlyField
			label={formatMessage({ id: "StrategyKind.label" })}
			value={value}
		/>
	)
}

export function SubscriptionEnd({ value }: ValueProp<Time>) {
	const { formatDate, formatMessage } = useIntl()
	return (
		<ReadonlyField
			label={formatMessage({ id: "SubscriptionEnd.label" })}
			value={formatDate(value, dayFormat)}
		/>
	)
}

export function SubscriptionPlan({ value }: ValueProp<SubscriptionPlanValue>) {
	const { formatMessage } = useIntl()
	return (
		<ReadonlyField
			label={formatMessage({ id: "SubscriptionPlan.label" })}
			value={value ? formatMessage({ id: `SubscriptionPlan.${value}` }) : undefined}
		/>
	)
}

export function SubscriptionTotalPrice({
	currency, monthlyPrice, numMonths
}: {
	currency: string
	monthlyPrice: number
	numMonths: number | undefined
}) {
	const { formatMessage, formatNumber } = useIntl()
	return (
		<ReadonlyField
			label={formatMessage({ id: "SubscriptionTotalPrice.label" })}
			value={numMonths ? formatNumber(monthlyPrice * numMonths, { style: "currency", currency }) : ""}
		/>
	)
}

export function WhenCreated({ value }: ValueProp<Time>) {
	const { formatDate, formatMessage } = useIntl()
	return (
		<ReadonlyField
			label={formatMessage({ id: "WhenCreated.label" })}
			value={value ? formatDate(value, dayFormat) : ""}
		/>
	)
}
