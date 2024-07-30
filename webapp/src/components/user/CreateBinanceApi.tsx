import { classnames } from "_/classnames"
import { Button, Control, Field, Title } from "_/components/library"
import { ApiKey } from "_/components/user/ApiKey"
import { ApiSecret } from "_/components/user/ApiSecret"
import { useUserApi } from "_/hooks/userApi"
import { FormEventHandler, useCallback, useEffect } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	apiKey: "apiKey",
	apiSecret: "apiSecret"
}
const fields = Object.keys(fieldName)

type Props = {
	refetchApiKey: () => void
}

export function CreateBinanceApi({ refetchApiKey }: Props) {
	const CREATE = useUserApi.CreateBinanceApiConfig()
	const isLoading = CREATE.isPending
	const readOnly = CREATE.isPending
	const isDone = CREATE.isDone

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			if (!CREATE.canRun) return
			const eventTarget = event.target as EventTarget & {
				[key in (typeof fields)[number]]?: { value: string }
			}
			const apiKey = eventTarget[fieldName.apiKey]?.value
			const apiSecret = eventTarget[fieldName.apiSecret]?.value
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
		</form>
	)
	// TODO error feedback
}
