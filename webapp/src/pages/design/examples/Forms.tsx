import { classnames } from "_/classnames"
import {
	Button,
	Buttons,
	Checkbox,
	Control,
	Field,
	InputField,
	SelectField,
	Title
} from "_/components/library"
import { InputHTMLAttributes, SelectHTMLAttributes, useState } from "react"

export function SimpleForm() {
	const [isPending, setIsPending] = useState(false)
	const [hasConsent, setHasConsent] = useState<boolean>(false)
	const [gender, setGender] = useState("")
	const [nick, setNick] = useState("satoshi")
	const [password, setPassword] = useState("")

	return (
		<form
			className={classnames("box")}
			onSubmit={(event) => {
				event.preventDefault()
				setIsPending(true)
			}}
		>
			<Title>Create account</Title>

			<InputField
				type="text"
				name="nick"
				label="nick"
				value={nick}
				onChange={(event) => {
					const { value } =
						event.target as unknown as InputHTMLAttributes<HTMLInputElement>
					if (typeof value === "string") setNick(value)
				}}
			/>

			<InputField
				type="password"
				name="password"
				label="password"
				value={password}
				onChange={(event) => {
					const { value } =
						event.target as unknown as InputHTMLAttributes<HTMLInputElement>
					if (typeof value === "string") setPassword(value)
				}}
			/>

			<SelectField
				value={gender}
				name="gender"
				label="gender"
				help={<>&nbsp;</>}
				onChange={(event) => {
					const { value } =
						event.target as unknown as SelectHTMLAttributes<HTMLSelectElement>
					if (typeof value === "string") setGender(value)
				}}
				options={[
					{ value: "M", label: "Male" },
					{ value: "F", label: "Female" },
					{ value: "X", label: "Other" }
				]}
			/>

			<Field>
				<Control>
					<Checkbox
						checked={hasConsent}
						onChange={(event) => {
							setHasConsent(
								Boolean(
									(
										event.target as unknown as InputHTMLAttributes<HTMLInputElement>
									).checked
								)
							)
						}}
					>
						<span className={classnames("ml-2")}>
							I agree with Terms of service.
						</span>
					</Checkbox>
				</Control>
			</Field>

			<Buttons>
				<Button
					color={hasConsent ? "primary" : undefined}
					disabled={!hasConsent}
					isLoading={isPending}
				>
					Enter
				</Button>
			</Buttons>
		</form>
	)
}
