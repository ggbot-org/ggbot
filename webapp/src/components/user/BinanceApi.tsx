import { ApiKey } from "_/components/ApiKey"
import {
	Button,
	Control,
	Field,
	Form,
	FormOnSubmit,
	Title
} from "_/components/library"
import {
	BinanceApiKeyPermissions,
	BinanceApiKeyPermissionsProps
} from "_/components/user/BinanceApiKeyPermissions"
import { ToastContext } from "_/contexts/Toast"
import { useUserApi } from "_/hooks/useUserApi"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

type Props = {
	apiKey: string
}

export const BinanceApi: FC<Props> = ({ apiKey }) => {
	const { formatMessage } = useIntl()

	const { toast } = useContext(ToastContext)

	const [permissions, setPermissions] =
		useState<BinanceApiKeyPermissionsProps["permissions"]>()

	const READ = useUserApi.ReadBinanceApiKeyPermissions()
	const isLoading = READ.isPending

	const onSubmit = useCallback<FormOnSubmit>(
		(event) => {
			event.preventDefault()
			if (READ.canRun) READ.request()
		},
		[READ]
	)

	useEffect(() => {
		if (READ.isDone) {
			setPermissions(READ.data)
			READ.reset()
		}
		if (READ.error) {
			READ.reset()
			toast.warning(formatMessage({ id: "BinanceApi.error" }))
		}
	}, [READ, formatMessage, toast])

	return (
		<Form box onSubmit={onSubmit}>
			<Title>
				<FormattedMessage id="BinanceApi.title" />
			</Title>

			<ApiKey isStatic value={apiKey} />

			<Field>
				<Control>
					<Button isLoading={isLoading}>
						<FormattedMessage id="BinanceApi.test" />
					</Button>
				</Control>
			</Field>

			<BinanceApiKeyPermissions permissions={permissions} />
		</Form>
	)
}
