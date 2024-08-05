import { Message } from "_/components/library"
import { ApiActionError, isApiActionServerSideError } from "@workspace/api"
import { ErrorExceededQuota, quotaType } from "@workspace/models"
import { FormattedMessage } from "react-intl"

type Props = {
	error: ApiActionError | undefined
}

export function SchedulingsErrorExceededQuota({ error }: Props) {
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
