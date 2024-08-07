import { classnames } from "_/classnames"
import { FormField } from "_/components/formFields"
import { Button, Control, Field, Title } from "_/components/library"
import { ApiKey, ApiSecret } from "_/components/user/apiFields"
import { useCreateBinanceApiConfig } from "_/hooks/user/api"
import { FormEventHandler, useCallback, useEffect } from "react"
import { FormattedMessage } from "react-intl"

export function CreateBinanceApi({ refetchApiKey }: { refetchApiKey: () => void }) {
	const CREATE = useCreateBinanceApiConfig()
	const isLoading = CREATE.isPending
	const readOnly = CREATE.isPending
	const isDone = CREATE.isDone

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			if (!CREATE.canRun) return
			const eventTarget = event.target as EventTarget & FormField
			const apiKey = eventTarget.apiKey.value
			const apiSecret = eventTarget.apiSecret.value
			if (!apiKey || !apiSecret) return
			CREATE.request({ apiKey, apiSecret })
		},
		[CREATE]
	)

	useEffect(() => {
		if (isDone) refetchApiKey()
	}, [isDone, refetchApiKey])

	return (
		<form className={classnames("box")} onSubmit={onSubmit}>
			<Title>
				<FormattedMessage id="CreateBinanceApi.title" />
			</Title>
			<ApiKey required readOnly={readOnly} />
			<ApiSecret required readOnly={readOnly} />
			<Field>
				<Control>
					<Button isLoading={isLoading}>
						<FormattedMessage id="CreateBinanceApi.button" />
					</Button>
				</Control>
			</Field>
		</form>
	)
	// TODO error feedback
}
