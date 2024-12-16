import { Classname } from '_/classnames'
import { GenericError } from '_/components/GenericError'
import { Button, ButtonProps, Column, Columns, Control, Field, Icon, InputField, Message, Title } from '_/components/library'
import { Email } from '_/components/readonlyFields'
import { TimeoutError } from '_/components/TimeoutError'
import { FormattedMessage } from '_/i18n/components'
import { api } from '_/routing/api'
import { isApiAuthVerifyRequestData, isApiAuthVerifyResponseData } from '@workspace/api'
import { EmailAddress } from '@workspace/models'
import { Reducer, useReducer } from 'react'

type FormField = {
	code: { value: string }
}
type FormFieldName = keyof FormField

export type AuthVerifyProps = {
	email: EmailAddress
	setToken: (token: string) => void
	resetEmail: () => void
}

type State = Partial<{
	gotTimeout: boolean
	hasGenericError: boolean
	hasInvalidInput: boolean
	isPending: boolean
	needToGenerateOneTimePasswordAgain: boolean
	verificationFailed: boolean
}>

type Action =
	| { type: 'SET_HAS_INVALID_INPUT' }
	| { type: 'VERIFY_REQUEST' }
	| {
		type: 'VERIFY_RESPONSE'
		data: Partial<Pick<State, 'needToGenerateOneTimePasswordAgain' | 'verificationFailed'>>
	}
	| { type: 'VERIFY_FAILURE' }
	| { type: 'VERIFY_TIMEOUT' }

function RegenerateOneTimePassword({ onClick }: Pick<ButtonProps, 'onClick'>) {
	return (
		<>
			<Message>
				<FormattedMessage id="RegenerateOneTimePassword.message" />
			</Message>
			<Field>
				<Control>
					<Button onClick={onClick}>
						<FormattedMessage id="RegenerateOneTimePassword.button" />
					</Button>
				</Control>
			</Field>
		</>
	)
}

export function AuthVerify({ email, resetEmail, setToken }: AuthVerifyProps) {
	const [{ gotTimeout, hasGenericError, hasInvalidInput, isPending, needToGenerateOneTimePasswordAgain, verificationFailed }, dispatch] = useReducer<Reducer<State, Action>>((state, action) => {
		if (action.type === 'SET_HAS_INVALID_INPUT') return { hasInvalidInput: true }
		if (action.type === 'VERIFY_REQUEST') return { isPending: true }
		if (action.type === 'VERIFY_RESPONSE') return { hasGenericError: true, ...action.data }
		if (action.type === 'VERIFY_FAILURE') return { hasGenericError: true }
		if (action.type === 'VERIFY_TIMEOUT') return { gotTimeout: true }
		return state
	}, {})

	return (
		<form
			className={'box' satisfies Classname}
			onReset={(event) => {
				event.preventDefault()
				resetEmail()
			}}
			onSubmit={
				async (event) => {
					try {
						event.preventDefault()
						if (isPending) return

						const eventTarget = event.target as EventTarget & FormField
						const code = eventTarget.code.value

						const requestData = { code, email }

						if (!isApiAuthVerifyRequestData(requestData)) {
							dispatch({ type: 'SET_HAS_INVALID_INPUT' })
							return
						}

						const controller = new AbortController()

						const timeoutId = setTimeout(() => {
							controller.abort()
							dispatch({ type: 'VERIFY_TIMEOUT' })
						}, 10_000)

						dispatch({ type: 'VERIFY_REQUEST' })

						const response = await fetch(api.auth.href, {
							body: JSON.stringify({ type: 'Verify', ...requestData }),
							headers: new Headers({ 'Content-Type': 'application/json' }),
							method: 'POST',
							signal: controller.signal
						})

						clearTimeout(timeoutId)

						if (!response.ok) throw new Error(response.statusText)

						const { data } = await response.json()

						if (data === null) {
							dispatch({ type: 'VERIFY_RESPONSE', data: { needToGenerateOneTimePasswordAgain: true } })
						} else if (isApiAuthVerifyResponseData(data)) {
							if (data.token) setToken(data.token)
							else dispatch({ type: 'VERIFY_RESPONSE', data: { verificationFailed: true } })
						}
					} catch (error) {
						dispatch({ type: 'VERIFY_FAILURE' })
						console.error(error)
					}
				}}
		>
			<Title>
				<FormattedMessage id="AuthVerify.title" />
			</Title>
			<Message>
				<FormattedMessage id="AuthVerify.checkEmail" />
			</Message>
			<Columns>
				<Column bulma="is-two-fifths-desktop">
					<Email value={email} />
					<Button onClick={resetEmail} size="small" tabIndex={-1} type="reset">
						<span>
							<FormattedMessage id="AuthVerify.resetEmail" />
						</span>
						<Icon name="x" size="1em" />
					</Button>
				</Column>
			</Columns>
			<Message>
				<FormattedMessage id="AuthVerify.enterOneTimePassword" />
			</Message>
			{/*
TODO do inputMode pattern maxLength work, at least on mobile?
 */}
			<InputField
				required
				autoComplete="one-time-code"
				className={'auth-verify__one-time-password' satisfies Classname}
				inputMode="numeric"
				label={<FormattedMessage id="OneTimePassword.label" />}
				maxLength={6}
				name={'code' satisfies FormFieldName}
				pattern="\d{6}"
				readOnly={isPending}
			/>
			<Field>
				<Control>
					<Button color="primary" isLoading={isPending}>
						<FormattedMessage id="AuthVerify.button" />
					</Button>
				</Control>
			</Field>
			{hasGenericError || (hasInvalidInput && <GenericError />)}
			{gotTimeout ? <TimeoutError /> : null}
			{verificationFailed ? (
				<Message color="warning">
					<FormattedMessage id="AuthVerify.failed" />
				</Message>
			) : null}
			{needToGenerateOneTimePasswordAgain ? (
				<RegenerateOneTimePassword onClick={resetEmail} />
			) : null}
		</form>
	)
}
