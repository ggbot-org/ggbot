import { Email } from "_/components/Email.js"
import { GenericError } from "_/components/GenericError.js"
import {
	Button,
	Control,
	Field,
	Form,
	FormOnSubmit,
	formValues,
	Modal,
	Title
} from "_/components/library"
import { TimeoutError } from "_/components/TimeoutError.js"
import { url } from "_/routing/authentication/URLs.js"
import { EmailAddress, isEmailAddress } from "@ggbot2/models"
import { isMaybeObject } from "@ggbot2/type-utils"
import {
	isApiAuthEnterRequestData,
	isApiAuthEnterResponseData
} from "@workspace/api"
import { FC, Reducer, useCallback, useReducer } from "react"
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
		switch (action.type) {
			case "ENTER_REQUEST":
				return { isPending: true }
			case "ENTER_FAILURE":
				return { hasGenericError: true }
			case "ENTER_TIMEOUT":
				return { gotTimeout: true }
			case "SET_HAS_INVALID_INPUT":
				return { hasInvalidInput: true }
			default:
				return state
		}
	}, {})

	const onSubmit = useCallback<FormOnSubmit>(
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

				const response = await fetch(url.authenticationEnter, {
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

				<Email required name={fieldName.email} readOnly={isPending} />

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
