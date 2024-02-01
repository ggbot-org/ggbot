import { classNames } from "_/classNames"
import {
	Button,
	Checkbox,
	Flex,
	Form,
	InputField,
	SelectField,
	Title
} from "_/components/library"
import { FC, InputHTMLAttributes, SelectHTMLAttributes, useState } from "react"

export const SimpleForm: FC = () => {
	const [isPending, setIsPending] = useState(false)
	const [hasConsent, setHasConsent] = useState<boolean | undefined>()
	const [gender, setGender] = useState("")
	const [nick, setNick] = useState("satoshi")
	const [password, setPassword] = useState("")

	return (
		<Form
			box
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

			<Flex alignItems="center" justify="space-between">
				<Checkbox
					checked={hasConsent}
					onChange={(event) => {
						setHasConsent(
							(
								event.target as unknown as InputHTMLAttributes<HTMLInputElement>
							).checked
						)
					}}
				>
					<span className={classNames("ml-2")}>
						I agree with Terms of service.
					</span>
				</Checkbox>

				<Button
					color={hasConsent ? "primary" : undefined}
					disabled={!hasConsent}
					isLoading={isPending}
				>
					Enter
				</Button>
			</Flex>
		</Form>
	)
}
