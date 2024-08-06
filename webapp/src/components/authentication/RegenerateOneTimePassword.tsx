import { Button, ButtonProps, Control, Field, Message } from "_/components/library"
import { FormattedMessage } from "react-intl"

export function RegenerateOneTimePassword({ onClick }: Pick<ButtonProps, "onClick">) {
	return (
		<>
			<Message>
				<FormattedMessage id="RegenerateOneTimePassword.message" />
			</Message>
			<Field>
				<Control>
					<Button onClick={onClick}>
						<FormattedMessage id="RegenerateOneTimePassword.button" />
					</Button>
				</Control>
			</Field>
		</>
	)
}
