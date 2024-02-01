import { ApiKey } from "_/components/ApiKey"
import {
	Button,
	Control,
	Field,
	Form,
	formValues,
	Title
} from "_/components/library"
import { ApiSecret } from "_/components/user/ApiSecret"
import { useUserApi } from "_/hooks/useUserApi"
import { FC, FormEventHandler, useCallback, useEffect } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	apiKey: "apiKey",
	apiSecret: "apiSecret"
}
const fields = Object.keys(fieldName)

type Props = {
	refetchApiKey: () => void
}

export const CreateBinanceApi: FC<Props> = ({ refetchApiKey }) => {
	const CREATE = useUserApi.CreateBinanceApiConfig()
	const isLoading = CREATE.isPending
	const readOnly = CREATE.isPending
	const isDone = CREATE.isDone

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			if (!CREATE.canRun) return
			const { apiKey, apiSecret } = formValues(event, fields)
			if (typeof apiKey !== "string") return
			if (typeof apiSecret !== "string") return
			CREATE.request({ apiKey, apiSecret })
		},
		[CREATE]
	)

	useEffect(() => {
		if (isDone) refetchApiKey()
	}, [isDone, refetchApiKey])

	return (
		<Form box onSubmit={onSubmit}>
			<Title>
				<FormattedMessage id="CreateBinanceApi.title" />
			</Title>

			<ApiKey required name={fieldName.apiKey} readOnly={readOnly} />

			<ApiSecret
				required
				name={fieldName.apiSecret}
				readOnly={readOnly}
			/>

			<Field>
				<Control>
					<Button isLoading={isLoading}>
						<FormattedMessage id="CreateBinanceApi.button" />
					</Button>
				</Control>
			</Field>
		</Form>
	)
	// TODO error feedback
}
