import { Email } from "_/components/Email"
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
import { SelectCountry } from "_/components/user/SelectCountry"
import {
	SubscriptionEnd,
	SubscriptionEndProps
} from "_/components/user/SubscriptionEnd"
import { SubscriptionNumMonths } from "_/components/user/SubscriptionNumMonths"
import { SubscriptionTotalPrice } from "_/components/user/SubscriptionTotalPrice"
import { AuthenticationContext } from "_/contexts/Authentication"
import { useStripeApi } from "_/hooks/useStripeApi"
import { useSubscription } from "_/hooks/useSubscription"
import { useUserApi } from "_/hooks/useUserApi"
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
import {
	FC,
	FormEventHandler,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react"
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

	const CREATE_CHECKOUT = useStripeApi.CreateCheckoutSession()
	const isLoading = CREATE_CHECKOUT.isPending
	const data = CREATE_CHECKOUT.data

	const CREATE_ORDER = useUserApi.CreatePurchaseOrder()

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
				numMonths,
				paymentProvider: "stripe",
				plan: "basic"
			})
		},
		[CREATE_ORDER, accountEmail]
	)

	const formattedMonthlyPrice = formatNumber(monthlyPrice, {
		style: "currency",
		currency: purchaseCurrency
	})

	useEffect(() => {
		if (!data) return
		// @ts-expect-error
		location.replace(data.url)
	}, [data])

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

					<Email isStatic value={accountEmail} />

					<SelectCountry name={fieldName.country} />

					<SubscriptionTotalPrice numMonths={numMonths} />

					<Buttons>
						<Button
							color="primary"
							isOutlined={!isYearlyPurchase}
							isLoading={isLoading}
						>
							<FormattedMessage id="SubscriptionPurchase.button" />
						</Button>
					</Buttons>
				</Form>
			</Column>
		</Columns>
	)
}
