import { InputField, InputFieldProps, randomKey } from "_/components/library"
import { useEffect, useState } from "react"

export function ReadonlyField({
	label, value
}: Pick<InputFieldProps, "label" | "value">) {
	// Notice that React does not re-render an input if its defaultValue changes;
	// so a key is used to force re-render.
	const [key, setKey] = useState(randomKey())
	useEffect(() => {
		if (!value) return
		setKey(randomKey())
	}, [value])
	return <InputField key={key} isStatic readOnly defaultValue={value} label={label} />
}
