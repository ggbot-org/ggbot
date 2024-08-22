import { classnames } from "_/classnames"
import { stringMaxLength } from "@workspace/models"
import { isName, normalizeName } from "@workspace/models"
import { ChangeEventHandler, ReactNode, useCallback, useEffect, useId, useState } from "react"
import { FormattedMessage } from "react-intl"
import { Control, Field, Help, Input, InputProps, Label as _Label, LabelProps as _LabelProps } from "trunx"

import { Label } from "./Label"
import { randomKey } from "./randomKey"

export function InputField({ autoComplete = "off", color, help, label, maxLength, spellCheck = "false", type, ...props }: InputFieldProps) {
	const id = useId()
	return (
		<Field>
			<Label htmlFor={id}>{label}</Label>
			<Control>
				<Input
					autoComplete={autoComplete}
					color={color}
					id={id}
					maxLength={maxLength ? maxLength : type === "text" ? stringMaxLength : undefined}
					spellCheck={spellCheck}
					type={type}
					{...props}
				/>
			</Control>
			{help ? <Help color={color}>{help}</Help> : null}
		</Field>
	)
}
export type InputFieldProps = Omit<InputProps, "id" | "defaultValue"> & {
	label: ReactNode
} & Partial<{
	help: ReactNode
}>

export function InputFieldName({ onChange, value, ...props }: Omit<
	InputFieldProps, "color" | "help" | "onBlur" | "type"
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
			type="text"
			value={value}
			{...props}
		/>
	)
}

export function ReadonlyInput ({ value }: ReadonlyInputProps) {
	// Notice that React does not re-render an input if its defaultValue changes;
	// so a key is used to force re-render.
	const [key, setKey] = useState(randomKey())
	useEffect(() => {
		if (!value) return
		setKey(randomKey())
	}, [value])
	return (
		<Input
			key={key}
			readOnly
			className={classnames(["readonly-input", "is-static"])}
			defaultValue={value}
		/>
	)
}
type ReadonlyInputProps = Pick<InputProps, "value">

export function ReadonlyField({ label, ...props }: ReadonlyInputProps & { label: ReactNode }) {
	return (
		<Field >
			<Label>{label}</Label>
			<Control>
				<ReadonlyInput {...props} />
			</Control>
		</Field>
	)
}
