import { classnames } from "_/classnames"
import { Button, Control, Field, Title } from "_/components/library"
import { ApiKey } from "_/components/readonlyFields"
import { BinanceApiKeyPermissions, BinanceApiKeyPermissionsProps } from "_/components/user/BinanceApiKeyPermissions"
import { ToastContext } from "_/contexts/Toast"
import { useReadBinanceAccountApiRestrictions } from "_/hooks/user/api"
import { GatewayTimeoutError } from "@workspace/http"
import { useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export function BinanceApi({ apiKey }: { apiKey: string }) {
	const { formatMessage } = useIntl()

	const { toast } = useContext(ToastContext)

	const [permissions, setPermissions] = useState<BinanceApiKeyPermissionsProps["permissions"]>()

	const READ = useReadBinanceAccountApiRestrictions()
	const isLoading = READ.isPending

	useEffect(() => {
		if (READ.isDone) {
			setPermissions(READ.data)
			READ.reset()
		}
		if (READ.error) {
			READ.reset()
			if (READ.error.name === GatewayTimeoutError.name) {
				toast.warning(formatMessage({ id: "BinanceApi.GatewayTimeoutError" }))
				return
			}
			toast.warning(formatMessage({ id: "BinanceApi.GenericError" }))
		}
	}, [READ, formatMessage, toast])

	return (
		<form
			className={classnames("box")}
			onSubmit={(event) => {
				event.preventDefault()
				if (READ.canRun) READ.request()
			}}
		>
			<Title>
				<FormattedMessage id="BinanceApi.title" />
			</Title>
			<ApiKey value={apiKey} />
			<Field>
				<Control>
					<Button isLoading={isLoading}>
						<FormattedMessage id="BinanceApi.test" />
					</Button>
				</Control>
			</Field>
			<BinanceApiKeyPermissions permissions={permissions} />
		</form>
	)
}
