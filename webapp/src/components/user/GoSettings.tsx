import { Button } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'

export function GoSettings() {
	return (
		<Button color="primary" onClick={() => GOTO(webapp.user.settings)}>
			<FormattedMessage id="GoSettings.label" />
		</Button>
	)
}
