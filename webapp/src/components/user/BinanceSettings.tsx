import { Column, Columns } from "_/components/library"
import { BinanceApi } from "_/components/user/BinanceApi"
import { CreateBinanceApi } from "_/components/user/CreateBinanceApi"
import { DeleteBinanceApi } from "_/components/user/DeleteBinanceApi"
import { useReadBinanceApiKey } from "_/hooks/user/api"
import { useCallback, useEffect } from "react"

export function BinanceSettings() {
	const READ = useReadBinanceApiKey()
	const remoteApiKey = READ.data

	const refetchApiKey = useCallback(() => {
		READ.reset()
	}, [READ])

	let apiKey
	if (remoteApiKey === null) apiKey = null
	if (remoteApiKey) apiKey = remoteApiKey.apiKey

	// Fetch apiKey.
	useEffect(() => {
		if (READ.canRun) READ.request()
	}, [READ])

	return (
		<>
			<Columns isMultiline>
				<Column bulma={["is-half-tablet", "is-two-thirds-desktop", "is-one-third-widescreen"]}>
					{apiKey ? <BinanceApi apiKey={apiKey} /> : null}
					{apiKey === null && <CreateBinanceApi refetchApiKey={refetchApiKey} />}
				</Column>
			</Columns>
			{apiKey ? <DeleteBinanceApi refetchApiKey={refetchApiKey} /> : null}
		</>
	)
}
