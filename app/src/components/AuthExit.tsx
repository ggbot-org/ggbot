import {
	Button,
	Column,
	Columns,
	Control,
	Field,
	Form,
	FormOnSubmit,
	Message,
	Modal,
	Title
} from "@ggbot2/design"
import { FC, useCallback, useContext } from "react"
import { FormattedMessage } from "react-intl"

import { AccountId } from "../components/AccountId.js"
import { Email } from "../components/Email.js"
import { AuthenticationContext } from "../contexts/Authentication.js"

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
	const { account } = useContext(AuthenticationContext)

	const onSubmit = useCallback<FormOnSubmit>(
		(event) => {
			event.preventDefault()
			exit()
		},
		[exit]
	)

	return (
		<Modal isActive={isActive} setIsActive={setIsActive}>
			<Form box onSubmit={onSubmit}>
				<Title>
					<FormattedMessage id="AuthExit.title" />
				</Title>

				<Message>
					<FormattedMessage id="AuthExit.message" />
				</Message>

				<Columns>
					<Column size="half">
						<Email isStatic value={account.email} />
					</Column>

					<Column size="half">
						<AccountId value={account.id} />
					</Column>
				</Columns>

				<Field isGrouped>
					<Control>
						<Button color="warning">
							<FormattedMessage id="AuthExit.button" />
						</Button>
					</Control>
				</Field>
			</Form>
		</Modal>
	)
}
