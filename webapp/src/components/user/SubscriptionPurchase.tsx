import { classnames } from '_/classnames'
import { Button, Buttons, Column, Columns, InputField, InputFieldProps, Message, Title } from '_/components/library'
import { SubscriptionEnd, SubscriptionTotalPrice } from '_/components/readonlyFields'
import { AuthenticationContext } from '_/contexts/Authentication'
import { useCreateCheckoutSession } from '_/hooks/user/api'
import { useSubscription } from '_/hooks/user/useSubscription'
import { formattedMessageMarkup } from '_/i18n/formattedMessageMarkup'
import { GOTO } from '_/routing/navigation'
import { isNaturalNumber, isYearlyPurchase, purchaseDefaultNumMonths as defaultNumMonths, purchaseMaxNumMonths as maxNumMonths, purchaseMinNumMonths as minNumMonths, SubscriptionPlan } from '@workspace/models'
import { getTime, now, Time } from 'minimal-time-helpers'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

type FormField = {
	numMonths: { value: number }
}
type FormFieldName = keyof FormField

function SubscriptionNumMonths({
	isYearlyPurchase, setValue, value, ...props
}: Omit<
	InputFieldProps,
	'label' | 'min' | 'max' | 'onChange' | 'step' | 'type'
> & {
	isYearlyPurchase: boolean | undefined
	setValue: (value: number | undefined) => void
}) {
	return (
		<InputField
			color={isYearlyPurchase ? 'primary' : undefined}
			label={<FormattedMessage id="SubscriptionNumMonths.label" />}
			max={maxNumMonths}
			min={minNumMonths}
			onChange={(event) => {
				const value = event.target.value as string
				const num = Number(value)
				if (value === '' || isNaN(num)) {
					setValue(undefined)
					return
				}
				if (num < minNumMonths) setValue(minNumMonths)
				if (num >= minNumMonths && num <= maxNumMonths) setValue(num)
				if (num > maxNumMonths) setValue(maxNumMonths)
			}}
			step={1}
			type="number"
			value={value}
			{...props}
		/>
	)
}

export function SubscriptionPurchase() {
	const { formatNumber } = useIntl()

	const { accountEmail } = useContext(AuthenticationContext)

	const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd } = useSubscription()

	const [numMonths, setNumMonths] = useState<number | undefined>(defaultNumMonths)

	const subscriptionPlan: SubscriptionPlan = 'basic'
	const monthlyPrice = Number(STRIPE_PLAN_BASIC_MONTHLY_PRICE)
	const currency = 'EUR'

	const CREATE_CHECKOUT = useCreateCheckoutSession()
	const { data: checkoutData, isPending } = CREATE_CHECKOUT

	let newSubscriptionEnd: Time | undefined
	if (isNaturalNumber(numMonths)) {
		const start = subscriptionEnd ? getTime(subscriptionEnd).plusOne.day : now()
		newSubscriptionEnd = getTime(start).plus(numMonths >= maxNumMonths - 1 ? maxNumMonths : numMonths).months
	}

	const isYearly = isYearlyPurchase({ numMonths })

	useEffect(() => {
		if (!checkoutData) return
		GOTO(new URL(checkoutData.url))
	}, [checkoutData])

	useEffect(() => {
		if (CREATE_CHECKOUT.isDone) CREATE_CHECKOUT.reset()
	}, [CREATE_CHECKOUT])

	if (canPurchaseSubscription === undefined || !canPurchaseSubscription) return null

	return (
		<Columns>
			<Column bulma="is-narrow">
				<form
					className={classnames('box')}
					onSubmit={(event) => {
						event.preventDefault()
						if (!CREATE_CHECKOUT.canRun) return

						const eventTarget = event.target as EventTarget & FormField
						const numMonthsStr = eventTarget.numMonths.value
						const numMonths = Number(numMonthsStr)

						let purchaseIsDisabled = false
						if (isNaturalNumber(numMonths)) {
							if (numMonths < minNumMonths) purchaseIsDisabled = true
							if (numMonths > maxNumMonths) purchaseIsDisabled = true
						}
						if (purchaseIsDisabled) return

						if (typeof numMonths !== 'number') return

						CREATE_CHECKOUT.request({ email: accountEmail, numMonths, plan: subscriptionPlan })
					}}
				>
					<Title>
						<FormattedMessage id="SubscriptionPurchase.title" />
					</Title>
					<Title is={5}>
						{(isYearly ? (
							<FormattedMessage id="SubscriptionPurchase.yearlyItemName" />
						) : (
							numMonths ? (
								<FormattedMessage
									id="SubscriptionPurchase.monthlyItemName"
									values={{ numMonths }}
								/>
							) : null
						))}
					</Title>
					{hasActiveSubscription ? (
						<Message color="danger">
							<FormattedMessage id="SubscriptionPurchase.couldRenew" />
						</Message>
					) : (
						<Message color="info">
							<FormattedMessage id="SubscriptionPurchase.pleasePurchase" />
							<br />
							<FormattedMessage id="SubscriptionPurchase.purchaseCurrency" />
						</Message>
					)}
					<Message>
						<FormattedMessage
							id="SubscriptionPurchase.oneMonthPrice"
							values={{ price: formatNumber(monthlyPrice, { style: 'currency', currency }) }}
						/>
						<br />
						<FormattedMessage
							id="SubscriptionPurchase.hint"
							values={{ numMonths: maxNumMonths, ...formattedMessageMarkup }}
						/>
					</Message>
					<Columns isMobile>
						<Column bulma="is-narrow">
							<SubscriptionNumMonths
								isYearlyPurchase={isYearly}
								name={'numMonths' satisfies FormFieldName}
								setValue={setNumMonths}
								value={numMonths}
							/>
						</Column>
						<Column>
							<SubscriptionEnd value={newSubscriptionEnd} />
						</Column>
					</Columns>
					<SubscriptionTotalPrice
						currency={currency}
						monthlyPrice={monthlyPrice}
						numMonths={numMonths}
					/>
					<Buttons>
						<Button
							color={isYearly ? 'primary' : undefined}
							isLoading={isPending}
						>
							<FormattedMessage id="SubscriptionPurchase.button" />
						</Button>
					</Buttons>
				</form>
			</Column>
		</Columns>
	)
}
