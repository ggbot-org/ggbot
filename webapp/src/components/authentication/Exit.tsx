import { AccountId } from "_/components/AccountId"
import { Email } from "_/components/Email"
import {
	Button,
	Buttons,
	Column,
	Columns,
	Form,
	FormOnReset,
	FormOnSubmit,
	Message,
	Modal,
	Title
} from "_/components/library"
import { AuthenticationContext } from "_/contexts/Authentication"
import { FC, useCallback, useContext } from "react"
import { FormattedMessage } from "react-intl"

export type AuthExitProps = {
	isActive: boolean
	setIsActive: (arg: boolean) => void
	exit: () => void
}

export const AuthExit: FC<AuthExitProps> = ({
	isActive,
	setIsActive,
	exit
}) => {
	// TODO can I get `exit` from context here? Instead of a prop (looks duplicated)
	const { accountId, accountEmail } = useContext(AuthenticationContext)

	const onSubmit = useCallback<FormOnSubmit>(
		(event) => {
			event.preventDefault()
			exit()
		},
		[exit]
	)

	const onReset = useCallback<FormOnReset>(
		(event) => {
			event.preventDefault()
			setIsActive(false)
		},
		[setIsActive]
	)

	return (
		<Modal isActive={isActive} setIsActive={setIsActive}>
			<Form box onSubmit={onSubmit} onReset={onReset}>
				<Title>
					<FormattedMessage id="AuthExit.title" />
				</Title>

				<Message>
					<FormattedMessage id="AuthExit.message" />
				</Message>

				<Columns>
					<Column size="half">
						<Email isStatic value={accountEmail} />
					</Column>

					<Column size="half">
						<AccountId value={accountId} />
					</Column>
				</Columns>

				<Buttons>
					<Button type="submit" color="warning">
						<FormattedMessage id="AuthExit.submit" />
					</Button>

					<Button type="reset">
						<FormattedMessage id="AuthExit.reset" />
					</Button>
				</Buttons>
			</Form>
		</Modal>
	)
}
