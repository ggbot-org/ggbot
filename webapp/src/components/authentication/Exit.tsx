import { classnames } from "_/classnames"
import { Email } from "_/components/Email"
import {
	Button,
	Buttons,
	Column,
	Columns,
	Message,
	Modal,
	Title
} from "_/components/library"
import { AccountId } from "_/components/readonlyFields"
import { FormEventHandler, useCallback } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	accountEmail: string
	accountId: string
	isActive: boolean
	setIsActive: (arg: boolean) => void
	exit: () => void
}

export function AuthExit({ accountEmail, accountId, isActive, setIsActive, exit }: Props) {

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
			<form
				className={classnames("box")}
				onSubmit={onSubmit}
				onReset={onReset}
			>
				<Title>
					<FormattedMessage id="AuthExit.title" />
				</Title>

				<Message>
					<FormattedMessage id="AuthExit.message" />
				</Message>

				<Columns>
					<Column bulma="is-half">
						<Email isStatic value={accountEmail} />
					</Column>

					<Column bulma="is-half">
						<AccountId value={accountId} />
					</Column>
				</Columns>

				<Buttons>
					<Button type="submit" color="warning">
						<FormattedMessage id="AuthExit.submit" />
					</Button>

					<Button type="reset">
						<FormattedMessage id="Button.cancel" />
					</Button>
				</Buttons>
			</form>
		</Modal>
	)
}
