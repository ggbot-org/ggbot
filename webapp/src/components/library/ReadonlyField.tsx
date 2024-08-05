import { InputField, InputFieldProps } from "_/components/library"

type Props = Pick<InputFieldProps, "label" | "value">

export function ReadonlyField({ label, value }: Props) {
	return <InputField isStatic readOnly defaultValue={value} label={label} />
}
