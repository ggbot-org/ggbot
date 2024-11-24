import { classnames } from '_/classnames'
import { Button, Control, Field, InputField, InputFieldProps, Title } from '_/components/library'
import { useCreateBinanceApiConfig } from '_/hooks/user/api'
import { FormattedMessage } from '_/i18n/components'
import { useEffect } from 'react'

type FormField = {
	apiKey: { value: string }
	apiSecret: { value: string }
}
type FormFieldName = keyof FormField

function ApiKey({ value, ...props }: Omit<InputFieldProps, 'label' | 'name'>) {
	return (
		<InputField
			label={<FormattedMessage id="ApiKey.label" />}
			name={'apiKey' satisfies FormFieldName}
			value={value}
			{...props}
		/>
	)
}

function ApiSecret(props: Omit<InputFieldProps, 'label' | 'name'>) {
	return (
		<InputField
			label={<FormattedMessage id="ApiSecret.label" />}
			name={'apiSecret' satisfies FormFieldName}
			{...props}
		/>
	)
}

export function CreateBinanceApi({ refetchApiKey }: { refetchApiKey: () => void }) {
	const CREATE = useCreateBinanceApiConfig()
	const isLoading = CREATE.isPending
	const readOnly = CREATE.isPending
	const isDone = CREATE.isDone

	useEffect(() => {
		if (isDone) refetchApiKey()
	}, [isDone, refetchApiKey])

	return (
		<form
			className={classnames('box')}
			onSubmit={(event) => {
				event.preventDefault()
				if (!CREATE.canRun) return
				const eventTarget = event.target as EventTarget & FormField
				const apiKey = eventTarget.apiKey.value
				const apiSecret = eventTarget.apiSecret.value
				if (!apiKey || !apiSecret) return
				CREATE.request({ apiKey, apiSecret })
			}}
		>
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
