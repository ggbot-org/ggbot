import {
	Button,
	Control,
	Field,
	Form,
	FormOnSubmit,
	Title,
	useToast
} from "@ggbot2/design"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { BinanceApiConfigContext } from "../../contexts/user/BinanceApiConfig.js"
import { useUserApi } from "../../hooks/useUserApi.js"
import { ApiKey } from "../ApiKey.js"
import {
	BinanceApiKeyPermissions,
	BinanceApiKeyPermissionsProps
} from "./BinanceApiKeyPermissions.js"

export const BinanceApi: FC = () => {
	const { formatMessage } = useIntl()
	const { toast } = useToast()
	const { apiKey } = useContext(BinanceApiConfigContext)

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