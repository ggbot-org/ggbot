import { Email } from "_/components/Email"
import {
	Button,
	Buttons,
	Checkmark,
	Column,
	Columns,
	Flex,
	Form,
	FormOnSubmit,
	formValues,
	Message,
	Title
} from "_/components/library"
import { SelectCountry } from "_/components/user/SelectCountry"
import {
	SubscriptionEnd,
	SubscriptionEndProps
} from "_/components/user/SubscriptionEnd"
import { SubscriptionNumMonths } from "_/components/user/SubscriptionNumMonths"
import { SubscriptionTotalPrice } from "_/components/user/SubscriptionTotalPrice"
import { AuthenticationContext } from "_/contexts/Authentication"
import { useSubscription } from "_/hooks/useSubscription"
import { useUtrustApi } from "_/hooks/useUtrustApi"
import {
	isAllowedCountryIsoCode2,
	isNaturalNumber,
	monthlyPrice,
	purchaseCurrency,
	purchaseDefaultNumMonths as defaultNumMonths,
	purchaseMaxNumMonths as maxNumMonths,
	purchaseMinNumMonths as minNumMonths
} from "@workspace/models"
import { getTime, now } from "minimal-time-helpers"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

const fieldName = {
	country: "country",
	numMonths: "numMonths"
}
const fields = Object.keys(fieldName)

export const SubscriptionPurchase: FC = () => {
	const { formatNumber, formatMessage } = useIntl()

	const { accountEmail } = useContext(AuthenticationContext)
	const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd } =
		useSubscription()

	const [numMonths, setNumMonths] = useState<number | undefined>(
		defaultNumMonths
	)

	const CREATE_ORDER = useUtrustApi.CreateUtrustOrder()
	const isLoading = CREATE_ORDER.isPending
	const data = CREATE_ORDER.data

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

	const onSubmit = useCallback<FormOnSubmit>(
		(event) => {
			event.preventDefault()
			if (!accountEmail) return
			if (!CREATE_ORDER.canRun) return

			const { country, numMonths: numMonthsStr } = formValues(
				event,
				fields
			)

			const numMonths = Number(numMonthsStr)

			let purchaseIsDisabled = false
			if (!country) purchaseIsDisabled = true
			if (isNaturalNumber(numMonths)) {
				if (numMonths < minNumMonths) purchaseIsDisabled = true
				if (numMonths > maxNumMonths) purchaseIsDisabled = true
			}
			if (purchaseIsDisabled) return

			if (typeof numMonths !== "number") return
			if (!isAllowedCountryIsoCode2(country)) return

			CREATE_ORDER.request({
				country,
				email: accountEmail,
				itemName,
				numMonths,
				plan: "basic"
			})
		},
		[CREATE_ORDER, accountEmail, itemName]
	)

	const formattedMonthlyPrice = formatNumber(monthlyPrice, {
		style: "currency",
		currency: purchaseCurrency
	})

	useEffect(() => {
		if (!data) return
	}, [data])

	if (!canPurchaseSubscription) return null

	return (
		<Form box onSubmit={onSubmit}>
			<Title>
				<FormattedMessage id="SubscriptionPurchase.title" />
			</Title>

			{hasActiveSubscription ? (
				<Message color="danger">
					<FormattedMessage id="SubscriptionPurchase.couldRenew" />
				</Message>
			) : null}

			<Message>
				<p>
					<FormattedMessage
						id="SubscriptionPurchase.oneMonthPrice"
						values={{ price: formattedMonthlyPrice }}
					/>
				</p>

				<Flex>
					<span>
						<FormattedMessage
							id="SubscriptionPurchase.hint"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</span>

					<Checkmark ok={isYearlyPurchase || undefined} />
				</Flex>
			</Message>

			<Email isStatic value={accountEmail} />

			<SelectCountry name={fieldName.country} />

			<Columns>
				<Column isNarrow>
					<SubscriptionNumMonths
						name={fieldName.numMonths}
						setValue={setNumMonths}
						value={numMonths}
					/>
				</Column>

				<Column>
					<SubscriptionEnd isStatic value={newSubscriptionEnd} />
				</Column>
			</Columns>

			<SubscriptionTotalPrice numMonths={numMonths} />

			<Title size={5}>{itemName}</Title>

			<Buttons>
				<Button color="primary" isLoading={isLoading}>
					<FormattedMessage id="SubscriptionPurchase.button" />
				</Button>
			</Buttons>
		</Form>
	)
}
