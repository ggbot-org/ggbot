import { classnames } from "_/classnames"
import { OneTimePassword } from "_/components/authentication/OneTimePassword"
import { RegenerateOneTimePassword } from "_/components/authentication/RegenerateOneTimePassword"
import { GenericError } from "_/components/GenericError"
import { Button, Column, Columns, Control, Field, Input, Label, Message, Modal, Title } from "_/components/library"
import { TimeoutError } from "_/components/TimeoutError"
import { formattedMessageMarkup } from "_/i18n/formattedMessageMarkup"
import { auth } from "_/routing/auth"
import { isApiAuthVerifyRequestData, isApiAuthVerifyResponseData } from "@workspace/api"
import { logging } from "@workspace/logging"
import { EmailAddress } from "@workspace/models"
import { Reducer, useReducer } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = { code: "code" }
const fields = Object.keys(fieldName)

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
		<Modal isActive>
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

							const eventTarget = event.target as EventTarget & { [key in (typeof fields)[number]]?: { value: string } }
							const code = eventTarget[fieldName.code]?.value

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
								headers: new Headers({
									"Content-Type": "application/json"
								}),
								method: "POST",
								signal: controller.signal
							})

							clearTimeout(timeoutId)

							if (!response.ok) throw new Error(response.statusText)

							const { data } = await response.json()

							if (data === null) {
								dispatch({ type: "VERIFY_RESPONSE", data: { needToGenerateOneTimePasswordAgain: true } })
							} else if (isApiAuthVerifyResponseData(data)) {
								const { token } = data
								if (token) {
									setToken(token)
								} else {
									dispatch({ type: "VERIFY_RESPONSE", data: { verificationFailed: true } })
								}
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
					<FormattedMessage
						id="AuthVerify.checkEmail"
						values={formattedMessageMarkup}
					/>
				</Message>

				<Columns>
					<Column bulma="is-half-desktop">
						<Label htmlFor="email">
							<FormattedMessage id="Email.label" />
						</Label>

						<Field hasAddons>
							<Control isExpanded>
								<Input
									isStatic
									defaultValue={email}
									id="email"
								/>
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
						<OneTimePassword required name={fieldName.code} readOnly={isPending} />
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
		</Modal>
	)
}
