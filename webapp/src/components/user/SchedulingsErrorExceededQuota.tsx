import { Message } from "@ggbot2/design"
import { ErrorExceededQuota, quotaType } from "@ggbot2/models"
import { isApiActionServerSideError } from "@workspace/api"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import { UseActionError } from "../../hooks/useAction.js"

type Props = {
	error: UseActionError
}

export const SchedulingsErrorExceededQuota: FC<Props> = ({ error }) => {
	if (!isApiActionServerSideError(error)) return null

	if (
		error.name !== ErrorExceededQuota.name &&
		error.info?.type !== quotaType.MAX_SCHEDULINGS_PER_ACCOUNT
	)
		return null

	return (
		<Message color="warning">
			<FormattedMessage id="SchedulingsErrorExceededQuota.message" />
		</Message>
	)
}