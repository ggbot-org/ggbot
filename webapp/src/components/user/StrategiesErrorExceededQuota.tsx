import { Message } from "_/components/library"
import { ApiActionError, isApiActionServerSideError } from "@workspace/api"
import { ErrorExceededQuota } from "@workspace/models"
import { FormattedMessage } from "react-intl"

type Props = {
	error: ApiActionError | undefined
}

export function StrategiesErrorExceededQuota({ error }: Props) {
	if (!isApiActionServerSideError(error)) return null

	if (error.name !== ErrorExceededQuota.errorName) return null

	return (
		<Message color="warning">
			<FormattedMessage id="StrategiesErrorExceededQuota.message" />
		</Message>
	)
}
