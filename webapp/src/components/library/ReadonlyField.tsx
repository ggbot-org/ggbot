import { InputField, InputFieldProps } from "_/components/library"

export function ReadonlyField({
	label, value
}: Pick<InputFieldProps, "label" | "value">) {
	return <InputField isStatic readOnly defaultValue={value} label={label} />
}
