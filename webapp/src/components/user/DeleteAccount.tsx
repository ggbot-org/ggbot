import { Button, Buttons, Checkbox, Column, Columns, Content, InputField, MainColor, Message, Modal } from "_/components/library"
import { AuthenticationContext } from "_/contexts/Authentication"
import { useDeleteAccount } from "_/hooks/user/api"
import { useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export function DeleteAccount() {
	const { formatMessage } = useIntl()
	const { accountId } = useContext(AuthenticationContext)

	const [accountIdConfirmation, setAccountIdConfirmation] = useState("")

	const accountIdConfirmed = accountIdConfirmation === accountId
	const color: MainColor | undefined = accountIdConfirmed
		? "danger"
		: undefined

	const DELETE = useDeleteAccount()
	const isLoading = DELETE.isPending

	const [hasConsent, setHasConsent] = useState<boolean>(false)
	const [modalIsActive, setModalIsActive] = useState(false)

	// Reset modal on close.
	useEffect(() => {
		if (modalIsActive) return
		setHasConsent(false)
		setAccountIdConfirmation("")
	}, [modalIsActive])

	return (
		<>
			<Button
				bulma={{ "is-skeleton": !accountId }}
				color="danger"
				onClick={() => {
					setModalIsActive(true)
				}}
			>
				<FormattedMessage id="DeleteAccount.button" />
			</Button>

			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<Message
					color={color}
					header={formatMessage({ id: "DeleteAccount.title" })}
				>
					<Content>
						<p>
							<FormattedMessage id="DeleteAccount.question" />
						</p>

						<Columns>
							<Column bulma="is-half">
								<InputField
									color={color}
									help={
										<FormattedMessage id="DeleteAccount.accountIdInputHelp" />
									}
									label={formatMessage({
										id: "AccountId.label"
									})}
									onChange={(event) => {
										setAccountIdConfirmation(
											event.target.value
										)
									}}
									value={accountIdConfirmation}
								/>
							</Column>
						</Columns>

						<Checkbox
							checked={hasConsent}
							color={color}
							disabled={!accountIdConfirmed}
							onChange={(event) => {
								setHasConsent(event.target.checked)
							}}
						/>

						<FormattedMessage id="DeleteAccount.consent" />
					</Content>

					<Buttons>
						<Button
							color={hasConsent ? color : undefined}
							disabled={!hasConsent}
							isLoading={isLoading}
							onClick={() => {
								if (!hasConsent) return
								if (DELETE.canRun) DELETE.request()
							}}
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
