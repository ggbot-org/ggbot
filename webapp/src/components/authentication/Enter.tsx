import { Email } from "_/components/Email"
import { GenericError } from "_/components/GenericError"
import {
	Button,
	Column,
	Columns,
	Control,
	Field,
	Form,
	formValues,
	Message,
	Modal,
	Title
} from "_/components/library"
import { TimeoutError } from "_/components/TimeoutError"
import { auth } from "_/routing/auth"
import {
	isApiAuthEnterRequestData,
	isApiAuthEnterResponseData
} from "@workspace/api"
import { EmailAddress, isEmailAddress } from "@workspace/models"
import { isMaybeObject } from "minimal-type-guard-helpers"
import { FC, FormEventHandler, Reducer, useCallback, useReducer } from "react"
import { FormattedMessage } from "react-intl"

export type AuthEnterProps = {
	setEmail: (email: EmailAddress) => void
}

type State = {
	gotTimeout: boolean
	hasGenericError: boolean
	hasInvalidInput: boolean
	isPending: boolean
}

const fieldName = {
	email: "email"
}
const fields = Object.keys(fieldName)

export const AuthEnter: FC<AuthEnterProps> = ({ setEmail }) => {
	const [
		{ gotTimeout, hasGenericError, hasInvalidInput, isPending },
		dispatch
	] = useReducer<
		Reducer<
			Partial<State>,
			| { type: "ENTER_REQUEST" }
			| { type: "ENTER_FAILURE" }
			| { type: "ENTER_TIMEOUT" }
			| { type: "SET_HAS_INVALID_INPUT" }
		>
	>((state, action) => {
		if (action.type === "ENTER_REQUEST") return { isPending: true }
		if (action.type === "ENTER_FAILURE") return { hasGenericError: true }
		if (action.type === "ENTER_TIMEOUT") return { gotTimeout: true }
		if (action.type === "SET_HAS_INVALID_INPUT")
			return { hasInvalidInput: true }
		return state
	}, {})

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		async (event) => {
			try {
				event.preventDefault()
				if (isPending) return

				const { email } = formValues(event, fields)

				if (!isEmailAddress(email)) {
					return
				}

				const requestData = { email }

				if (!isApiAuthEnterRequestData(requestData)) {
					dispatch({ type: "SET_HAS_INVALID_INPUT" })
					return
				}

				const controller = new AbortController()
				const timeout = 10000

				const timeoutId = setTimeout(() => {
					controller.abort()
					dispatch({ type: "ENTER_TIMEOUT" })
				}, timeout)

				dispatch({ type: "ENTER_REQUEST" })

				const response = await fetch(auth.enter.href, {
					body: JSON.stringify(requestData),
					headers: new Headers({
						"Content-Type": "application/json"
					}),
					method: "POST",
					signal: controller.signal
				})

				clearTimeout(timeoutId)

				if (!response.ok) throw response.status

				const responseJson = await response.json()

				if (isMaybeObject<{ data: unknown }>(responseJson)) {
					const { data } = responseJson
					if (isApiAuthEnterResponseData(data)) {
						if (data.emailSent) {
							setEmail(email)
						}
					}
				}
			} catch (error) {
				console.error(error)
				dispatch({ type: "ENTER_FAILURE" })
			}
		},
		[isPending, setEmail]
	)

	return (
		<Modal isActive>
			<Form box onSubmit={onSubmit}>
				<Title>
					<FormattedMessage id="AuthEnter.title" />
				</Title>

				<Message>
					<FormattedMessage
						id="AuthEnter.info"
						values={{
							em: (chunks) => <em>{chunks}</em>
						}}
					/>
				</Message>

				<Columns>
					<Column size={{ desktop: "half" }}>
						<Email
							required
							name={fieldName.email}
							readOnly={isPending}
						/>
					</Column>
				</Columns>

				<Field isGrouped>
					<Control>
						<Button color="primary" isLoading={isPending}>
							<FormattedMessage id="AuthEnter.button" />
						</Button>
					</Control>
				</Field>

				<>
					{hasGenericError || (hasInvalidInput && <GenericError />)}

					{gotTimeout ? <TimeoutError /> : null}
				</>
			</Form>
		</Modal>
	)
}
