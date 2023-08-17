import {
	isApiAuthVerifyRequestData,
	isApiAuthVerifyResponseData
} from "@ggbot2/api"
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
} from "@ggbot2/design"
import { isDev } from "@ggbot2/env"
import { EmailAddress } from "@ggbot2/models"
import { NonEmptyString } from "@ggbot2/type-utils"
import { FC, Reducer, useCallback, useReducer } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { GenericError } from "../components/GenericError.js"
import { OneTimePassword } from "../components/OneTimePassword.js"
import { RegenerateOneTimePassword } from "../components/RegenerateOneTimePassword.js"
import { TimeoutError } from "../components/TimeoutError.js"
import { url } from "../routing/URLs.js"

export type AuthVerifyProps = {
	email: EmailAddress
	setJwt: (jwt: NonEmptyString) => void
	resetEmail: () => void
}

type State = {
	gotTimeout: boolean
	hasGenericError: boolean
	hasInvalidInput: boolean
	isPending: boolean
	needToGenerateOneTimePasswordAgain: boolean
	verificationFailed: boolean
}

export const AuthVerify: FC<AuthVerifyProps> = ({
	email,
	resetEmail,
	setJwt
}) => {
	const { formatMessage } = useIntl()

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
	] = useReducer<
		Reducer<
			Partial<State>,
			| { type: "SET_HAS_INVALID_INPUT" }
			| { type: "VERIFY_REQUEST" }
			| {
					type: "VERIFY_RESPONSE"
					data: Partial<
						Pick<
							State,
							| "needToGenerateOneTimePasswordAgain"
							| "verificationFailed"
						>
					>
			  }
			| { type: "VERIFY_FAILURE" }
			| { type: "VERIFY_TIMEOUT" }
		>
	>(
		(state, action) => {
			if (isDev)
				console.info("AuthVerify", JSON.stringify(action, null, 2))
			switch (action.type) {
				case "SET_HAS_INVALID_INPUT":
					return { hasInvalidInput: true }

				case "VERIFY_REQUEST":
					return { isPending: true }

				case "VERIFY_RESPONSE":
					return { hasGenericError: true, ...action.data }

				case "VERIFY_FAILURE":
					return { hasGenericError: true }

				case "VERIFY_TIMEOUT":
					return { gotTimeout: true }

				default:
					return state
			}
		},
		{ hasGenericError: false }
	)

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
					const { jwt } = data
					if (jwt) {
						setJwt(jwt)
					} else {
						dispatch({
							type: "VERIFY_RESPONSE",
							data: { verificationFailed: true }
						})
					}
				}
			} catch (error) {
				dispatch({ type: "VERIFY_FAILURE" })
				console.error(error)
			}
		},
		[dispatch, email, isPending, setJwt]
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
							em: (chunks) => <em>{chunks}</em>,
							resetEmail: formatMessage({
								id: "AuthVerify.resetEmail"
							})
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
							<FormattedMessage id="AuthVerify.failed" />
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
