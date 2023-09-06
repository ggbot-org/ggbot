import { InputField, InputFieldProps } from "_/components/library"
import { purchaseCurrency, totalPurchase } from "@ggbot2/models"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<InputFieldProps, "color" | "help" | "label" | "readOnly"> & {
	isYearlyPurchase: boolean | undefined
	numMonths: number | undefined
}

export const SubscriptionTotalPrice: FC<Props> = ({
	isYearlyPurchase,
	numMonths
}) => {
	const { formatMessage, formatNumber } = useIntl()

	return (
		<InputField
			isStatic
			label={formatMessage({ id: "SubscriptionTotalPrice.label" })}
			color={isYearlyPurchase ? "primary" : undefined}
			value={
				numMonths
					? formatNumber(totalPurchase(numMonths), {
							style: "currency",
							currency: purchaseCurrency
					  })
					: ""
			}
			help={
				isYearlyPurchase
					? formatMessage({ id: "SubscriptionTotalPrice.discount" })
					: undefined
			}
		/>
	)
}
