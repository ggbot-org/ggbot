import { Button } from '_/components/library'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { FormattedMessage } from 'react-intl'

export function GoSettings() {
	return (
		<Button color="primary" onClick={() => GOTO(webapp.user.settings)}>
			<FormattedMessage id="GoSettings.label" />
		</Button>
	)
}
