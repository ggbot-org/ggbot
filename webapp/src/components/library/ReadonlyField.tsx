import { InputField, InputFieldProps } from "_/components/library"

type Props = Pick<InputFieldProps, "label" | "value">

export function ReadonlyField({ label, value }: Props) {
	return <InputField readOnly isStatic label={label} defaultValue={value} />
}
