import { Classname } from '_/classnames'
import { GenericError } from '_/components/GenericError'
import {
	Button,
	Checkbox,
	Control,
	Field,
	InputField,
	Message,
	Title,
} from '_/components/library'
import { TermsAndPolicyLinks } from '_/components/TermsAndPolicyLinks'
import { TimeoutError } from '_/components/TimeoutError'
import { FormattedMessage } from '_/i18n/components'
import { useIntl } from '_/i18n/hooks'
import { api } from '_/routing/api'
import {
	isApiAuthEnterRequestData,
	isApiAuthEnterResponseData,
} from '@workspace/api'
import { EmailAddress, isEmailAddress } from '@workspace/models'
import { isMaybeObject } from 'minimal-type-guard-helpers'
import {
	ChangeEventHandler,
	InputHTMLAttributes,
	useCallback,
	useReducer,
	useState,
} from 'react'

type FormField = {
	email: { value: string }
}
type FormFieldName = keyof FormField

export type AuthEnterProps = {
	setEmail: (email: EmailAddress) => void
}

type State = {
	gotTimeout: boolean
	hasGenericError: boolean
	hasInvalidInput: boolean
	isPending: boolean
}

type Action =
	| { type: 'ENTER_REQUEST' }
	| { type: 'ENTER_FAILURE' }
	| { type: 'ENTER_TIMEOUT' }
	| { type: 'SET_HAS_INVALID_INPUT' }

export function AuthEnter({ setEmail }: AuthEnterProps) {
	const { formatMessage } = useIntl()

	const [
		{ gotTimeout, hasGenericError, hasInvalidInput, isPending },
		dispatch,
	] = useReducer<Partial<State>, [any]>((state, action: Action) => {
		if (action.type === 'ENTER_REQUEST') return { isPending: true }
		if (action.type === 'ENTER_FAILURE') return { hasGenericError: true }
		if (action.type === 'ENTER_TIMEOUT') return { gotTimeout: true }
		if (action.type === 'SET_HAS_INVALID_INPUT')
			return { hasInvalidInput: true }
		return state
	}, {})

	const [termsAndPolicyAccepted, setTermsAndPolicyAccepted] =
		useState<boolean>(false)

	const disabled = !termsAndPolicyAccepted

	const onChangeTermsAndPolicyAccepted = useCallback<
		ChangeEventHandler<HTMLInputElement>
	>((event) => {
		const { checked } =
			event.target as unknown as InputHTMLAttributes<HTMLInputElement>
		setTermsAndPolicyAccepted(Boolean(checked))
	}, [])

	return (
		<form
			className={'box' satisfies Classname}
			onSubmit={async (event) => {
				try {
					event.preventDefault()
					if (isPending) return

					const eventTarget = event.target as EventTarget & FormField
					const email = eventTarget.email.value

					if (!isEmailAddress(email)) return

					const requestData = { email }

					if (!isApiAuthEnterRequestData(requestData)) {
						dispatch({ type: 'SET_HAS_INVALID_INPUT' })
						return
					}

					const controller = new AbortController()

					const timeoutId = setTimeout(() => {
						controller.abort()
						dispatch({ type: 'ENTER_TIMEOUT' })
					}, 10_000)

					dispatch({ type: 'ENTER_REQUEST' })

					const response = await fetch(api.auth.href, {
						body: JSON.stringify({ type: 'Enter', data: requestData }),
						headers: new Headers({ 'Content-Type': 'application/json' }),
						method: 'POST',
						signal: controller.signal,
					})

					clearTimeout(timeoutId)

					if (!response.ok) throw response.status

					const responseJson = await response.json()

					if (isMaybeObject<{ data: unknown }>(responseJson)) {
						const { data } = responseJson
						if (isApiAuthEnterResponseData(data)) {
							if (data.emailSent) setEmail(email)
						}
					}
				} catch {
					dispatch({ type: 'ENTER_FAILURE' })
				}
			}}
		>
			<Title>
				<FormattedMessage id="AuthEnter.title" />
			</Title>
			<Message>
				<FormattedMessage id="AuthEnter.info" />
			</Message>
			<InputField
				required
				autoComplete="email"
				label={<FormattedMessage id="Email.label" />}
				name={'email' satisfies FormFieldName}
				readOnly={isPending}
				type="email"
			/>
			<Field>
				<Control>
					<Checkbox
						checked={termsAndPolicyAccepted}
						color="primary"
						onChange={onChangeTermsAndPolicyAccepted}
					>
						<FormattedMessage
							id="AuthEnter.termsAndPolicy"
							values={{
								terms: formatMessage({ id: 'Terms.title' }),
								policy: formatMessage({ id: 'Privacy.title' }),
							}}
						/>
					</Checkbox>
				</Control>
			</Field>
			<Field isGrouped>
				<Control>
					<Button
						color={disabled ? undefined : 'primary'}
						disabled={disabled}
						isLoading={isPending}
					>
						<FormattedMessage id="AuthEnter.button" />
					</Button>
				</Control>
			</Field>
			<TermsAndPolicyLinks />
			{hasGenericError || (hasInvalidInput && <GenericError />)}
			{gotTimeout ? <TimeoutError /> : null}
		</form>
	)
}
