import { Email } from "_/components/Email"
import { GenericError } from "_/components/GenericError"
import {
	Button,
	Checkbox,
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
import { TermsAndPolicyLinks } from "_/components/TermsAndPolicyLinks"
import { TimeoutError } from "_/components/TimeoutError"
import { formattedMessageMarkup } from "_/i18n/formattedMessageMarkup"
import { auth } from "_/routing/auth"
import {
	isApiAuthEnterRequestData,
	isApiAuthEnterResponseData
} from "@workspace/api"
import { EmailAddress, isEmailAddress } from "@workspace/models"
import { isMaybeObject } from "minimal-type-guard-helpers"
import {
	ChangeEventHandler,
	FC,
	FormEventHandler,
	InputHTMLAttributes,
	Reducer,
	useCallback,
	useReducer,
	useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"

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
	const { formatMessage } = useIntl()

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

	const [termsAndPolicyAccepted, setTermsAndPolicyAccepted] = useState<
		boolean | undefined
	>()

	const disabled = !termsAndPolicyAccepted

	const onChangeTermsAndPolicyAccepted = useCallback<
		ChangeEventHandler<HTMLInputElement>
	>((event) => {
		const { checked } =
			event.target as unknown as InputHTMLAttributes<HTMLInputElement>
		setTermsAndPolicyAccepted(checked)
	}, [])

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
			} catch {
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
						values={formattedMessageMarkup}
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

				<Field>
					<Control>
						<Checkbox
							color="primary"
							checked={termsAndPolicyAccepted}
							onChange={onChangeTermsAndPolicyAccepted}
						>
							<FormattedMessage
								id="AuthEnter.termsAndPolicy"
								values={{
									terms: formatMessage({ id: "Terms.title" }),
									policy: formatMessage({
										id: "Privacy.title"
									})
								}}
							/>
						</Checkbox>
					</Control>
				</Field>

				<Field isGrouped>
					<Control>
						<Button
							disabled={disabled}
							color={disabled ? undefined : "primary"}
							isLoading={isPending}
						>
							<FormattedMessage id="AuthEnter.button" />
						</Button>
					</Control>
				</Field>

				<TermsAndPolicyLinks />

				<>
					{hasGenericError || (hasInvalidInput && <GenericError />)}

					{gotTimeout ? <TimeoutError /> : null}
				</>
			</Form>
		</Modal>
	)
}
