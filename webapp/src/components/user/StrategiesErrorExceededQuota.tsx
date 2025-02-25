import { Message } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { ApiActionError, isApiActionServerSideError } from '@workspace/api'
import { ErrorExceededQuota } from '@workspace/models'

export function StrategiesErrorExceededQuota({
	error,
}: {
	error: ApiActionError | undefined
}) {
	if (!isApiActionServerSideError(error)) return null
	if (error.name !== ErrorExceededQuota.errorName) return null
	return (
		<Message color="warning">
			<FormattedMessage id="StrategiesErrorExceededQuota.message" />
		</Message>
	)
}
