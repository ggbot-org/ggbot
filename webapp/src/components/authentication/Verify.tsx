import { OneTimePassword } from "_/components/authentication/OneTimePassword"
import { RegenerateOneTimePassword } from "_/components/authentication/RegenerateOneTimePassword"
import { GenericError } from "_/components/GenericError"
import {
	Button,
	Column,
	Columns,
	Control,
	Field,
	Form,
	FormOnReset,
	FormOnSubmit,
	Input,
	Label,
	Message,
	Modal,
	Title
} from "_/components/library"
import { TimeoutError } from "_/components/TimeoutError"
import { logging } from "_/logging"
import { url } from "_/routing/authentication/URLs"
import {
	isApiAuthVerifyRequestData,
	isApiAuthVerifyResponseData
} from "@workspace/api"
import { EmailAddress } from "@workspace/models"
import { FC, Reducer, useCallback, useReducer } from "react"
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
			data: Partial<
				Pick<
					State,
					"needToGenerateOneTimePasswordAgain" | "verificationFailed"
				>
			>
	  }
	| { type: "VERIFY_FAILURE" }
	| { type: "VERIFY_TIMEOUT" }

const { info, warn } = logging("authentication")

export const AuthVerify: FC<AuthVerifyProps> = ({
	email,
	resetEmail,
	setToken
}) => {
	const [
		{
			gotTimeout,
			hasGenericError,
			hasInvalidInput,
			isPending,
			needToGenerateOneTimePasswordAgain,
			verificationFailed
		},
		dispatch
	] = useReducer<Reducer<State, Action>>((state, action) => {
		info("AuthVerify", JSON.stringify(action, null, 2))
		if (action.type === "SET_HAS_INVALID_INPUT")
			return { hasInvalidInput: true }

		if (action.type === "VERIFY_REQUEST") return { isPending: true }

		if (action.type === "VERIFY_RESPONSE")
			return { hasGenericError: true, ...action.data }

		if (action.type === "VERIFY_FAILURE") return { hasGenericError: true }

		if (action.type === "VERIFY_TIMEOUT") return { gotTimeout: true }

		return state
	}, {})

	const onReset = useCallback<FormOnReset>(
		(event) => {
			event.preventDefault()
			resetEmail()
		},
		[resetEmail]
	)

	const onSubmit = useCallback<FormOnSubmit>(
		async (event) => {
			try {
				event.preventDefault()
				if (isPending) return

				const code = (
					event.target as EventTarget & { code: { value: string } }
				).code.value

				const requestData = { code, email }

				if (!isApiAuthVerifyRequestData(requestData)) {
					dispatch({ type: "SET_HAS_INVALID_INPUT" })
					return
				}

				const controller = new AbortController()
				const timeout = 10000

				const timeoutId = setTimeout(() => {
					controller.abort()
					dispatch({ type: "VERIFY_TIMEOUT" })
				}, timeout)

				dispatch({ type: "VERIFY_REQUEST" })

				const response = await fetch(url.authenticationVerify, {
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
					dispatch({
						type: "VERIFY_RESPONSE",
						data: { needToGenerateOneTimePasswordAgain: true }
					})
				} else if (isApiAuthVerifyResponseData(data)) {
					const { token } = data
					if (token) {
						setToken(token)
					} else {
						dispatch({
							type: "VERIFY_RESPONSE",
							data: { verificationFailed: true }
						})
					}
				}
			} catch (error) {
				dispatch({ type: "VERIFY_FAILURE" })
				warn(error)
			}
		},
		[dispatch, email, isPending, setToken]
	)

	return (
		<Modal isActive>
			<Form box onSubmit={onSubmit} onReset={onReset}>
				<Title>
					<FormattedMessage id="AuthVerify.title" />
				</Title>

				<Message>
					<FormattedMessage
						id="AuthVerify.checkEmail"
						values={{
							em: (chunks) => <em>{chunks}</em>
						}}
					/>
				</Message>

				<Columns>
					<Column size={{ desktop: "half" }}>
						<Label htmlFor="email">
							<FormattedMessage id="Email.label" />
						</Label>

						<Field hasAddons>
							<Control isExpanded>
								<Input
									isStatic
									id="email"
									defaultValue={email}
								/>
							</Control>

							<Control>
								<Button type="reset" onClick={resetEmail}>
									<FormattedMessage id="AuthVerify.resetEmail" />
								</Button>
							</Control>
						</Field>
					</Column>
				</Columns>

				<Message>
					<FormattedMessage
						id="AuthVerify.enterOneTimePassword"
						values={{ em: (chunks) => <em>{chunks}</em> }}
					/>
				</Message>

				<Columns>
					<Column size={{ desktop: "half" }}>
						<OneTimePassword
							required
							name="code"
							readOnly={isPending}
						/>
					</Column>

					<Column size="half" />
				</Columns>

				<Field>
					<Control>
						<Button color="primary" isLoading={isPending}>
							<FormattedMessage id="AuthVerify.button" />
						</Button>
					</Control>
				</Field>

				<>
					{hasGenericError || (hasInvalidInput && <GenericError />)}

					{gotTimeout ? <TimeoutError /> : null}

					{verificationFailed ? (
						<Message color="warning">
							<FormattedMessage
								id="AuthVerify.failed"
								values={{ em: (chunks) => <em>{chunks}</em> }}
							/>
						</Message>
					) : null}

					{needToGenerateOneTimePasswordAgain ? (
						<RegenerateOneTimePassword onClick={resetEmail} />
					) : null}
				</>
			</Form>
		</Modal>
	)
}
