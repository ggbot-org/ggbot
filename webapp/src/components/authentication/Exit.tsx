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
import { useStoredAccountInfo } from "_/hooks/user/useStoredAccountInfo"
import { FormEventHandler, useCallback } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	isActive: boolean
	setIsActive: (arg: boolean) => void
	exit: () => void
}

export function AuthExit({ isActive, setIsActive, exit }: Props) {
	const account = useStoredAccountInfo()

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
						<Email isStatic value={account?.email} />
					</Column>

					<Column bulma="is-half">
						<AccountId value={account?.id} />
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
