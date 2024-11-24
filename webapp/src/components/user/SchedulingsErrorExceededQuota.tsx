import { Message } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { ApiActionError, isApiActionServerSideError } from '@workspace/api'
import { ErrorExceededQuota, quotaType } from '@workspace/models'

export function SchedulingsErrorExceededQuota({ error }: { error: ApiActionError | undefined }) {
	if (!isApiActionServerSideError(error)) return null
	if (
		error.name !== ErrorExceededQuota.name &&
		error.info?.type !== quotaType.MAX_SCHEDULINGS_PER_ACCOUNT
	) return null
	return (
		<Message color="warning">
			<FormattedMessage id="SchedulingsErrorExceededQuota.message" />
		</Message>
	)
}
