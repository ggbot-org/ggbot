import { Column, Columns } from "_/components/library"
import { BinanceApi } from "_/components/user/BinanceApi"
import { CreateBinanceApi } from "_/components/user/CreateBinanceApi"
import { DeleteBinanceApi } from "_/components/user/DeleteBinanceApi"
import { useUserApi } from "_/hooks/useUserApi"
import { useCallback, useEffect } from "react"

export function BinanceSettings() {
	const READ_API_KEY = useUserApi.ReadBinanceApiKey()
	const remoteApiKey = READ_API_KEY.data

	const refetchApiKey = useCallback(() => {
		READ_API_KEY.reset()
	}, [READ_API_KEY])

	let apiKey
	if (remoteApiKey === null) apiKey = null
	if (remoteApiKey) apiKey = remoteApiKey.apiKey

	// Fetch apiKey.
	useEffect(() => {
		if (READ_API_KEY.canRun) READ_API_KEY.request()
	}, [READ_API_KEY])

	return (
		<>
			<Columns isMultiline>
				<Column
					bulma={[
						"is-half-tablet",
						"is-two-thirds-desktop",
						"is-one-third-widescreen"
					]}
				>
					{apiKey ? <BinanceApi apiKey={apiKey} /> : null}

					{apiKey === null && (
						<CreateBinanceApi refetchApiKey={refetchApiKey} />
					)}
				</Column>
			</Columns>

			{apiKey ? <DeleteBinanceApi refetchApiKey={refetchApiKey} /> : null}
		</>
	)
}
