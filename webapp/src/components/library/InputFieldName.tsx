import { InputField, InputFieldProps } from "_/components/library"
import { isName, normalizeName } from "@workspace/models"
import { ChangeEventHandler, ReactNode, useCallback, useState } from "react"
import { FormattedMessage } from "react-intl"

export function InputFieldName({ onChange, value, ...props }: Omit<
	InputFieldProps, "color" | "help" | "isStatic" | "onBlur" | "type"
>) {
	const [{ color, help }, setFeedback] = useState<{
		color: InputFieldProps["color"] | undefined
		help: ReactNode
	}>({ color: undefined, help: <>&nbsp;</> })

	const onBlur = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
		const name = event.target.value
		if (!isName(name)) {
			setFeedback({ color: "danger", help: <FormattedMessage id="Name.invalid" /> })
		}
		if (name !== normalizeName(name)) {
			setFeedback({ color: "warning", help: <FormattedMessage id="Name.hasSpaces" /> })
		}
	}, [])

	const onChangeWrapper = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			const name = event.target.value
			if (name.length === 0 || isName(name)) setFeedback({ color: undefined, help: <>&nbsp;</> })
			onChange?.(event)
		},
		[onChange]
	)

	return (
		<InputField
			color={color}
			help={help}
			onBlur={onBlur}
			onChange={onChangeWrapper}
			spellCheck="false"
			type="text"
			value={value}
			{...props}
		/>
	)
}
