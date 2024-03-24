import {
	Button,
	Buttons,
	Column,
	Columns,
	Form,
	formValues,
	Message,
	Title
} from "_/components/library"
import {
	SubscriptionEnd,
	SubscriptionEndProps
} from "_/components/user/SubscriptionEnd"
import { SubscriptionNumMonths } from "_/components/user/SubscriptionNumMonths"
import { SubscriptionTotalPrice } from "_/components/user/SubscriptionTotalPrice"
import { useStripeApi } from "_/hooks/useStripeApi"
import { useSubscription } from "_/hooks/useSubscription"
import {
	isNaturalNumber,
	monthlyPrice,
	purchaseCurrency,
	purchaseDefaultNumMonths as defaultNumMonths,
	purchaseMaxNumMonths as maxNumMonths,
	purchaseMinNumMonths as minNumMonths
} from "@workspace/models"
import { getTime, now } from "minimal-time-helpers"
import { FC, FormEventHandler, useCallback, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

const fieldName = {
	numMonths: "numMonths"
}
const fields = Object.keys(fieldName)

export const SubscriptionPurchase: FC = () => {
	const { formatNumber, formatMessage } = useIntl()

	const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd } =
		useSubscription()

	const [numMonths, setNumMonths] = useState<number | undefined>(
		defaultNumMonths
	)

	const CREATE_CHECKOUT = useStripeApi.CreateCheckoutSession()
	const { data: checkoutData, isPending } = CREATE_CHECKOUT

	let newSubscriptionEnd: SubscriptionEndProps["value"]
	if (isNaturalNumber(numMonths)) {
		const start = subscriptionEnd
			? getTime(subscriptionEnd).plusOne.day
			: now()
		newSubscriptionEnd = getTime(start).plus(
			numMonths >= maxNumMonths - 1 ? maxNumMonths : numMonths
		).months
	}

	const isYearlyPurchase: boolean | undefined =
		typeof numMonths === "number" && numMonths >= maxNumMonths - 1
			? true
			: undefined

	let itemName = ""
	if (isYearlyPurchase) {
		itemName = formatMessage({ id: "SubscriptionPurchase.yearlyItemName" })
	} else if (numMonths)
		itemName = formatMessage(
			{
				id: "SubscriptionPurchase.monthlyItemName"
			},
			{ numMonths }
		)

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			if (!CREATE_CHECKOUT.canRun) return

			const { numMonths: numMonthsStr } = formValues(event, fields)

			const numMonths = Number(numMonthsStr)

			let purchaseIsDisabled = false
			if (isNaturalNumber(numMonths)) {
				if (numMonths < minNumMonths) purchaseIsDisabled = true
				if (numMonths > maxNumMonths) purchaseIsDisabled = true
			}
			if (purchaseIsDisabled) return

			if (typeof numMonths !== "number") return

			CREATE_CHECKOUT.request({
				numMonths,
				plan: "basic"
			})
		},
		[CREATE_CHECKOUT]
	)

	const formattedMonthlyPrice = formatNumber(monthlyPrice, {
		style: "currency",
		currency: purchaseCurrency
	})

	useEffect(() => {
		if (!checkoutData) return
		location.replace(checkoutData.url)
	}, [checkoutData])

	useEffect(() => {
		if (CREATE_CHECKOUT.isDone) CREATE_CHECKOUT.reset()
	}, [CREATE_CHECKOUT])

	if (canPurchaseSubscription === undefined || !canPurchaseSubscription)
		return null

	return (
		<Columns>
			<Column isNarrow>
				<Form box onSubmit={onSubmit}>
					<Title>
						<FormattedMessage id="SubscriptionPurchase.title" />
					</Title>

					<Title size={5}>{itemName}</Title>

					{hasActiveSubscription ? (
						<Message color="danger">
							<FormattedMessage id="SubscriptionPurchase.couldRenew" />
						</Message>
					) : (
						<Message color="info">
							<FormattedMessage id="SubscriptionPurchase.pleasePurchase" />
						</Message>
					)}

					<Message>
						<FormattedMessage
							id="SubscriptionPurchase.oneMonthPrice"
							values={{ price: formattedMonthlyPrice }}
						/>

						<br />

						<FormattedMessage
							id="SubscriptionPurchase.hint"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Message>

					<Columns isMobile>
						<Column isNarrow>
							<SubscriptionNumMonths
								name={fieldName.numMonths}
								isYearlyPurchase={isYearlyPurchase}
								setValue={setNumMonths}
								value={numMonths}
							/>
						</Column>

						<Column>
							<SubscriptionEnd
								isStatic
								value={newSubscriptionEnd}
							/>
						</Column>
					</Columns>

					<SubscriptionTotalPrice numMonths={numMonths} />

					<Buttons>
						<Button
							color="primary"
							isOutlined={!isYearlyPurchase}
							isLoading={isPending}
						>
							<FormattedMessage id="SubscriptionPurchase.button" />
						</Button>
					</Buttons>
				</Form>
			</Column>
		</Columns>
	)
}
