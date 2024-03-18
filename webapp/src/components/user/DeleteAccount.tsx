import {
	Button,
	Buttons,
	Checkbox,
	Column,
	Columns,
	Content,
	InputField,
	MainColor,
	Message,
	Modal
} from "_/components/library"
import { AuthenticationContext } from "_/contexts/Authentication"
import { useUserApi } from "_/hooks/useUserApi"
import {
	ChangeEventHandler,
	FC,
	InputHTMLAttributes,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const DeleteAccount: FC = () => {
	const { formatMessage } = useIntl()

	const { accountId } = useContext(AuthenticationContext)

	const [accountIdConfirmation, setAccountIdConfirmation] = useState("")

	const disabled = accountId === undefined

	const accountIdConfirmed = accountIdConfirmation === accountId
	const color: MainColor | undefined = accountIdConfirmed
		? "danger"
		: undefined

	const DELETE = useUserApi.DeleteAccount()
	const isLoading = DELETE.isPending

	const [hasConsent, setHasConsent] = useState<boolean | undefined>()
	const [modalIsActive, setModalIsActive] = useState(false)

	const onChangeAccountIdInput: ChangeEventHandler<HTMLInputElement> = (
		event
	) => {
		const value = (
			event.target as unknown as InputHTMLAttributes<HTMLInputElement>
		).value
		if (typeof value === "string") setAccountIdConfirmation(value)
	}

	const onChangeConsent = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			setHasConsent(
				(
					event.target as unknown as InputHTMLAttributes<HTMLInputElement>
				).checked
			)
		},
		[setHasConsent]
	)

	const onClickConfirmation = useCallback(() => {
		if (!hasConsent) return
		if (DELETE.canRun) DELETE.request()
	}, [DELETE, hasConsent])

	// Reset modal on close.
	useEffect(() => {
		if (modalIsActive) return
		setHasConsent(false)
		setAccountIdConfirmation("")
	}, [modalIsActive])

	return (
		<>
			<Button
				isOutlined
				color="danger"
				onClick={() => {
					setModalIsActive(true)
				}}
				disabled={disabled}
			>
				<FormattedMessage id="DeleteAccount.button" />
			</Button>

			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<Message
					header={formatMessage({ id: "DeleteAccount.title" })}
					color={color}
				>
					<Content>
						<p>
							<FormattedMessage id="DeleteAccount.question" />
						</p>

						<Columns>
							<Column size="half">
								<InputField
									value={accountIdConfirmation}
									label={formatMessage({
										id: "AccountId.label"
									})}
									onChange={onChangeAccountIdInput}
									help={
										<FormattedMessage id="DeleteAccount.accountIdInputHelp" />
									}
								/>
							</Column>
						</Columns>

						<Checkbox
							checked={hasConsent}
							disabled={!accountIdConfirmed}
							onChange={onChangeConsent}
							color={color}
						/>

						<FormattedMessage id="DeleteAccount.consent" />
					</Content>

					<Buttons>
						<Button
							color={hasConsent ? color : undefined}
							disabled={!hasConsent}
							isLoading={isLoading}
							onClick={onClickConfirmation}
						>
							<FormattedMessage id="DeleteAccount.confirmation" />
						</Button>

						<Button
							onClick={() => {
								setModalIsActive(false)
							}}
						>
							<FormattedMessage id="DeleteAccount.dismiss" />
						</Button>
					</Buttons>
				</Message>
			</Modal>
		</>
	)
}
