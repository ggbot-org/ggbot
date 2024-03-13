import { Column, Columns, InputField, SelectField } from "_/components/library"
import {
	Frequency,
	FrequencyInterval,
	isFrequencyInterval,
	isNaturalNumber,
	NaturalNumber
} from "@workspace/models"
import {
	ChangeEventHandler,
	FC,
	InputHTMLAttributes,
	SelectHTMLAttributes,
	useCallback
} from "react"
import { useIntl } from "react-intl"

export type FrequencyInputProps = Partial<{ disabled: boolean }> & {
	frequency: Pick<Frequency, "interval"> & {
		every: NaturalNumber | ""
	}
	disabledIntervalOptions?: FrequencyInterval[]
	setFrequency: (arg: FrequencyInputProps["frequency"]) => void
}

type FrequencyIntervalOption = {
	disabled?: boolean
	value: FrequencyInterval
	label: string
}

export const FrequencyInput: FC<FrequencyInputProps> = ({
	disabled,
	disabledIntervalOptions = [],
	frequency: { interval, every },
	setFrequency
}) => {
	const { formatMessage } = useIntl()

	const frequencyIntervalOptions: FrequencyIntervalOption[] = [
		{
			value: "1d",
			disabled: disabledIntervalOptions.includes("1d"),
			label: formatMessage({ id: "FrequencyInput.day" })
		},
		{
			value: "1h",
			disabled: disabledIntervalOptions.includes("1h"),
			label: formatMessage({ id: "FrequencyInput.hour" })
		},
		{
			disabled: disabledIntervalOptions.includes("1m"),
			value: "1m",
			label: formatMessage({ id: "FrequencyInput.minute" })
		}
	]

	const onChangeFrequencyEvery = useCallback<
		ChangeEventHandler<HTMLInputElement>
	>(
		(event) => {
			const { value } =
				event.target as unknown as InputHTMLAttributes<HTMLInputElement>
			const every = value === "" ? value : Number(value)
			if (isNaturalNumber(every) || every === "")
				setFrequency({
					interval,
					every
				})
		},
		[interval, setFrequency]
	)

	const onChangeFrequencyInterval = useCallback<
		ChangeEventHandler<HTMLSelectElement>
	>(
		(event) => {
			const { value } =
				event.target as unknown as SelectHTMLAttributes<HTMLSelectElement>
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
					color={
						disabledIntervalOptions.includes(interval)
							? "danger"
							: undefined
					}
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
