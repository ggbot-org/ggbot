import { Column, Columns } from "@ggbot2/design"
import { FC, useContext } from "react"

import { BinanceApi } from "../components/BinanceApi.js"
import { CreateBinanceApi } from "../components/CreateBinanceApi.js"
import { DeleteBinanceApi } from "../components/DeleteBinanceApi.js"
import { BinanceApiConfigContext } from "../contexts/BinanceApiConfig.js"

export const BinanceSettings: FC = () => {
	const { hasApiKey } = useContext(BinanceApiConfigContext)

	return (
		<>
			<Columns isMultiline>
				<Column
					size={{
						tablet: "half",
						desktop: "two-thirds",
						widescreen: "one-third"
					}}
				>
					{hasApiKey ? <BinanceApi /> : <CreateBinanceApi />}
				</Column>
			</Columns>

			<DeleteBinanceApi />
		</>
	)
}
