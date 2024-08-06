import { classnames } from "_/classnames"
import { Email } from "_/components/Email"
import { Button, Buttons, Column, Columns, Message, Modal, Title } from "_/components/library"
import { AccountId } from "_/components/readonlyFields"
import { FormattedMessage } from "react-intl"

export function AuthExit({
	accountEmail, accountId, isActive, setIsActive, exit
}: {
	accountEmail: string
	accountId: string
	isActive: boolean
	setIsActive: (arg: boolean) => void
	exit: () => void
}) {
	return (
		<Modal isActive={isActive} setIsActive={setIsActive}>
			<form
				className={classnames("box")}
				onReset={(event) => {
					event.preventDefault()
					setIsActive(false)
				}}
				onSubmit={(event) => {
					event.preventDefault()
					exit()
				}}
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
					<Button color="warning" type="submit">
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
