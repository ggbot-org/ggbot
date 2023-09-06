import { SelectField, SelectFieldProps } from "_/components/library"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<SelectFieldProps, "label">

export const SelectCountry: FC<Props> = (props) => {
	const { formatMessage } = useIntl()

	return (
		<SelectField
			label={formatMessage({ id: "SelectCountry.label" })}
			{...props}
		/>
	)
}
