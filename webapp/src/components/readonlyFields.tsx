import { ReadonlyField } from '_/components/library'
import { dayFormat } from '_/i18n/formats'
import { EmailAddress, SubscriptionPlan as SubscriptionPlanValue } from '@workspace/models'
import { Time } from 'minimal-time-helpers'
import { FormattedMessage, useIntl } from 'react-intl'

type ValueProp<T> = {
	value: T | undefined
}

export function AccountId({ value }: ValueProp<string>) {
	return (
		<ReadonlyField
			label={<FormattedMessage id="AccountId.label" />}
			value={value}
		/>
	)
}

function truncateApiKey(apiKey: string | undefined): string {
	if (!apiKey) return ''
	return `${apiKey.substring(0, 10)}...${ apiKey.substring(apiKey.length - 10, apiKey.length) }`
}
export function ApiKey({ value }: ValueProp<string>) {
	return (
		<ReadonlyField
			label={<FormattedMessage id="ApiKey.label" />}
			value={truncateApiKey(value)}
		/>
	)
}

export function Email({ value }: ValueProp<EmailAddress>) {
	return (
		<ReadonlyField
			label={<FormattedMessage id="Email.label" />}
			value={value}
		/>
	)
}

export function StrategyId({ value }: ValueProp<string>) {
	return (
		<ReadonlyField
			label={<FormattedMessage id="StrategyId.label" />}
			value={value}
		/>
	)
}

export function StrategyKind({ value }: ValueProp<string>) {
	return (
		<ReadonlyField
			label={<FormattedMessage id="StrategyKind.label" />}
			value={value}
		/>
	)
}

export function StrategyName({ value }: ValueProp<string>) {
	return (
		<ReadonlyField
			label={<FormattedMessage id="StrategyName.label" />}
			value={value}
		/>
	)
}

export function SubscriptionEnd({ value }: ValueProp<Time>) {
	const { formatDate } = useIntl()
	return (
		<ReadonlyField
			label={<FormattedMessage id="SubscriptionEnd.label" />}
			value={formatDate(value, dayFormat)}
		/>
	)
}

export function SubscriptionPlan({ value }: ValueProp<SubscriptionPlanValue>) {
	const { formatMessage } = useIntl()
	return (
		<ReadonlyField
			label={<FormattedMessage id="SubscriptionPlan.label" />}
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
	const { formatNumber } = useIntl()
	return (
		<ReadonlyField
			label={<FormattedMessage id="SubscriptionTotalPrice.label" />}
			value={numMonths ? formatNumber(monthlyPrice * numMonths, { style: 'currency', currency }) : ''}
		/>
	)
}

export function WhenCreated({ value }: ValueProp<Time>) {
	const { formatDate } = useIntl()
	return (
		<ReadonlyField
			label={<FormattedMessage id="WhenCreated.label" />}
			value={value ? formatDate(value, dayFormat) : ''}
		/>
	)
}
