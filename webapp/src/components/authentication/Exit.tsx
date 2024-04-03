import { AccountId } from "_/components/AccountId"
import { Email } from "_/components/Email"
import {
	Button,
	Buttons,
	Column,
	Columns,
	Form,
	Message,
	Modal,
	Title
} from "_/components/library"
import { useStoredAccount } from "_/hooks/useStoredAccount"
import { FC, FormEventHandler, useCallback } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	isActive: boolean
	setIsActive: (arg: boolean) => void
	exit: () => void
}

export const AuthExit: FC<Props> = ({ isActive, setIsActive, exit }) => {
	const account = useStoredAccount()

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			exit()
		},
		[exit]
	)

	const onReset = useCallback<FormEventHandler<HTMLFormElement>>(
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
						<Email isStatic value={account?.email} />
					</Column>

					<Column size="half">
						<AccountId value={account?.id} />
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
