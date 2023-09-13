import { ApiKey } from "_/components/ApiKey"
import {
	Button,
	Control,
	Field,
	Form,
	FormOnSubmit,
	formValues,
	Title
} from "_/components/library"
import { ApiSecret } from "_/components/user/ApiSecret"
import { BinanceApiConfigContext } from "_/contexts/user/BinanceApiConfig"
import { useUserApi } from "_/hooks/useUserApi"
import { FC, useCallback, useContext, useEffect } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	apiKey: "apiKey",
	apiSecret: "apiSecret"
}
const fields = Object.keys(fieldName)

export const CreateBinanceApi: FC = () => {
	const { hasApiKey, refetchApiKey } = useContext(BinanceApiConfigContext)

	const CREATE = useUserApi.CreateBinanceApiConfig()
	const isLoading = CREATE.isPending
	const readOnly = CREATE.isPending
	const isDone = CREATE.isDone

	const onSubmit = useCallback<FormOnSubmit>(
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

	if (hasApiKey === undefined || hasApiKey) return null

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
