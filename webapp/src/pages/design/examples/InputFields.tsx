import { InputField } from "_/components/library"

export function InputFields() {
	return (
		<form>
			<InputField label="normal" />
			<InputField color="primary" label="primary" />
			<InputField color="warning" label="warning" />
			<InputField color="danger" label="danger" />
			<InputField color="success" label="success" />
		</form>
	)
}
