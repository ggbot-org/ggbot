import {
	Button,
	ButtonProps,
	Control,
	Field,
	Message
} from "_/components/library"
import { FormattedMessage } from "react-intl"

type Props = Pick<ButtonProps, "onClick">

export function RegenerateOneTimePassword({ onClick }: Props) {
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
