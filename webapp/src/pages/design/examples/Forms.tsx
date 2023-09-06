import { classNames } from "_/classNames"
import {
	Button,
	Checkbox,
	CheckboxOnChange,
	Flex,
	Form,
	FormOnSubmit,
	InputField,
	InputOnChange,
	SelectField,
	SelectOnChange,
	Title
} from "_/components/library"
import { FC, useCallback, useState } from "react"

export const SimpleForm: FC = () => {
	const [isPending, setIsPending] = useState(false)
	const [hasConsent, setHasConsent] = useState(false)
	const [gender, setGender] = useState("")
	const [nick, setNick] = useState("satoshi")
	const [password, setPassword] = useState("")

	const onChangeConsent = useCallback<CheckboxOnChange>(
		(event) => {
			setHasConsent(event.target.checked)
		},
		[setHasConsent]
	)

	const onChangeGender = useCallback<SelectOnChange>((event) => {
		setGender(event.target.value)
	}, [])

	const onChangeNick = useCallback<InputOnChange>((event) => {
		setNick(event.target.value)
	}, [])

	const onChangePassword = useCallback<InputOnChange>((event) => {
		setPassword(event.target.value)
	}, [])

	const onSubmit = useCallback<FormOnSubmit>(
		(event) => {
			event.preventDefault()
			setIsPending(true)
		},
		[setIsPending]
	)

	return (
		<Form box onSubmit={onSubmit}>
			<Title>Create account</Title>

			<InputField
				type="text"
				name="nick"
				label="nick"
				value={nick}
				onChange={onChangeNick}
			/>

			<InputField
				type="password"
				name="password"
				label="password"
				value={password}
				onChange={onChangePassword}
			/>

			<SelectField
				value={gender}
				name="gender"
				label="gender"
				help={<>&nbsp;</>}
				onChange={onChangeGender}
				options={[
					{ value: "M", label: "Male" },
					{ value: "F", label: "Female" },
					{ value: "X", label: "Other" }
				]}
			/>

			<Flex alignItems="center" justify="space-between">
				<Checkbox checked={hasConsent} onChange={onChangeConsent}>
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
