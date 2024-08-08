import { classnames } from "_/classnames"
import { FormField, FormFieldName } from "_/components/formFields"
import { GenericError } from "_/components/GenericError"
import { Button, ButtonProps, Column, Columns, Control, Field, Input, InputField, InputFieldProps, Label, Message, Title } from "_/components/library"
import { TimeoutError } from "_/components/TimeoutError"
import { formattedMessageMarkup } from "_/i18n/formattedMessageMarkup"
import { auth } from "_/routing/auth"
import { isApiAuthVerifyRequestData, isApiAuthVerifyResponseData } from "@workspace/api"
import { logging } from "@workspace/logging"
import { EmailAddress } from "@workspace/models"
import { Reducer, useReducer } from "react"
import { FormattedMessage } from "react-intl"

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
	| { type: "SET_HAS_INVALID_INPUT" }
	| { type: "VERIFY_REQUEST" }
	| {
		type: "VERIFY_RESPONSE"
		data: Partial<Pick<State, "needToGenerateOneTimePasswordAgain" | "verificationFailed">>
	}
	| { type: "VERIFY_FAILURE" }
	| { type: "VERIFY_TIMEOUT" }

const { debug } = logging("authentication")

function OneTimePassword(props: Pick<InputFieldProps, "required" | "name" | "readOnly">) {
	return (
		<InputField
			label={<FormattedMessage id="OneTimePassword.label" />}
			{...props}
		/>
	)
}

function RegenerateOneTimePassword({ onClick }: Pick<ButtonProps, "onClick">) {
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
		if (action.type === "SET_HAS_INVALID_INPUT") return { hasInvalidInput: true }
		if (action.type === "VERIFY_REQUEST") return { isPending: true }
		if (action.type === "VERIFY_RESPONSE") return { hasGenericError: true, ...action.data }
		if (action.type === "VERIFY_FAILURE") return { hasGenericError: true }
		if (action.type === "VERIFY_TIMEOUT") return { gotTimeout: true }
		return state
	}, {})

	return (
		<form
			className={classnames("box")}
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
							dispatch({ type: "SET_HAS_INVALID_INPUT" })
							return
						}

						const controller = new AbortController()

						const timeoutId = setTimeout(() => {
							controller.abort()
							dispatch({ type: "VERIFY_TIMEOUT" })
						}, 10_000)

						dispatch({ type: "VERIFY_REQUEST" })

						const response = await fetch(auth.verify.href, {
							body: JSON.stringify(requestData),
							headers: new Headers({ "Content-Type": "application/json" }),
							method: "POST",
							signal: controller.signal
						})

						clearTimeout(timeoutId)

						if (!response.ok) throw new Error(response.statusText)

						const { data } = await response.json()

						if (data === null) {
							dispatch({ type: "VERIFY_RESPONSE", data: { needToGenerateOneTimePasswordAgain: true } })
						} else if (isApiAuthVerifyResponseData(data)) {
							if (data.token) setToken(data.token)
							else dispatch({ type: "VERIFY_RESPONSE", data: { verificationFailed: true } })
						}
					} catch (error) {
						dispatch({ type: "VERIFY_FAILURE" })
						debug(error)
					}
				}}
		>
			<Title>
				<FormattedMessage id="AuthVerify.title" />
			</Title>
			<Message>
				<FormattedMessage id="AuthVerify.checkEmail" values={formattedMessageMarkup} />
			</Message>
			<Columns>
				<Column bulma="is-half-desktop">
					<Label htmlFor="email">
						<FormattedMessage id="Email.label" />
					</Label>
					<Field hasAddons>
						<Control isExpanded>
							<Input isStatic defaultValue={email} id="email" />
						</Control>
						<Control>
							<Button onClick={resetEmail} type="reset">
								<FormattedMessage id="AuthVerify.resetEmail" />
							</Button>
						</Control>
					</Field>
				</Column>
			</Columns>
			<Message>
				<FormattedMessage id="AuthVerify.enterOneTimePassword" values={formattedMessageMarkup} />
			</Message>
			<Columns>
				<Column bulma="is-half-desktop">
					<OneTimePassword required name={"code" satisfies FormFieldName} readOnly={isPending} />
				</Column>
				<Column bulma="is-half" />
			</Columns>
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
					<FormattedMessage id="AuthVerify.failed" values={formattedMessageMarkup} />
				</Message>
			) : null}
			{needToGenerateOneTimePasswordAgain ? (
				<RegenerateOneTimePassword onClick={resetEmail} />
			) : null}
		</form>
	)
}
