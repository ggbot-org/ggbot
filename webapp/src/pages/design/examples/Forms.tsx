import { Classname } from '_/classnames'
import { Button, Buttons, Checkbox, Control, Field, InputField, SelectField, Title } from '_/components/library'
import { useState } from 'react'

export function SimpleForm() {
	const [isPending, setIsPending] = useState(false)
	const [hasConsent, setHasConsent] = useState<boolean>(false)
	const [gender, setGender] = useState('')
	const [nick, setNick] = useState('satoshi')
	const [password, setPassword] = useState('')

	return (
		<form
			className={'box' satisfies Classname}
			onSubmit={(event) => {
				event.preventDefault()
				setIsPending(true)
			}}
		>
			<Title>Create account</Title>
			<InputField
				label="nick"
				name="nick"
				onChange={(event) => setNick(event.target.value)}
				type="text"
				value={nick}
			/>
			<InputField
				label="password"
				name="password"
				onChange={(event) => setPassword(event.target.value)}
				type="password"
				value={password}
			/>
			<SelectField
				help={<>&nbsp;</>}
				label="gender"
				name="gender"
				onChange={(event) => setGender(event.target.value)}
				options={[
					{ value: 'M', label: 'Male' },
					{ value: 'F', label: 'Female' },
					{ value: 'X', label: 'Other' }
				]}
				value={gender}
			/>
			<Field>
				<Control>
					<Checkbox
						checked={hasConsent}
						onChange={(event) => setHasConsent(Boolean(event.target.checked))}
					>
						<span className={'ml-2' satisfies Classname}>I agree with Terms of service.</span>
					</Checkbox>
				</Control>
			</Field>
			<Buttons>
				<Button
					color={hasConsent ? 'primary' : undefined}
					disabled={!hasConsent}
					isLoading={isPending}
				>
					Enter
				</Button>
			</Buttons>
		</form>
	)
}
