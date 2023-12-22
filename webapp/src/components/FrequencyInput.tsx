import {
	Column,
	Columns,
	InputField,
	InputOnChange,
	SelectField,
	SelectOnChange
} from "_/components/library"
import {
	Frequency,
	FrequencyInterval,
	isFrequencyInterval,
	isNaturalNumber,
	NaturalNumber
} from "@workspace/models"
import { FC, useCallback } from "react"
import { useIntl } from "react-intl"

export type FrequencyInputProps = Partial<{ disabled: boolean }> & {
	frequency: Pick<Frequency, "interval"> & {
		every: NaturalNumber | ""
	}
	setFrequency: (arg: FrequencyInputProps["frequency"]) => void
}

type FrequencyIntervalOption = {
	value: FrequencyInterval
	label: string
}

export const FrequencyInput: FC<FrequencyInputProps> = ({
	disabled,
	frequency: { interval, every },
	setFrequency
}) => {
	const { formatMessage } = useIntl()

	const frequencyIntervalOptions: FrequencyIntervalOption[] = [
		{
			value: "1h",
			label: formatMessage({ id: "FrequencyInput.hour" })
		},
		{ value: "1m", label: formatMessage({ id: "FrequencyInput.minute" }) }
	]

	const onChangeFrequencyEvery = useCallback<InputOnChange>(
		(event) => {
			const value = event.target.value
			const every = value === "" ? value : Number(value)
			if (isNaturalNumber(every) || every === "")
				setFrequency({
					interval,
					every
				})
		},
		[interval, setFrequency]
	)

	const onChangeFrequencyInterval = useCallback<SelectOnChange>(
		(event) => {
			const value = event.target.value
			if (isFrequencyInterval(value))
				setFrequency({
					every,
					interval: value
				})
		},
		[every, setFrequency]
	)

	return (
		<Columns isMobile>
			<Column size="one-third">
				<InputField
					disabled={disabled}
					label={formatMessage({ id: "FrequencyInput.every" })}
					onChange={onChangeFrequencyEvery}
					min={1}
					step={1}
					value={every}
				/>
			</Column>

			<Column size="half">
				<SelectField
					disabled={disabled}
					label={formatMessage({ id: "FrequencyInput.interval" })}
					onChange={onChangeFrequencyInterval}
					options={frequencyIntervalOptions}
					value={interval}
				/>
			</Column>
		</Columns>
	)
}
