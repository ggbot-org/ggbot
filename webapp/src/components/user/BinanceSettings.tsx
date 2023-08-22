import { Column, Columns } from "@ggbot2/design"
import { FC, useContext } from "react"

import { BinanceApiConfigContext } from "../../contexts/user/BinanceApiConfig.js"
import { BinanceApi } from "./BinanceApi.js"
import { CreateBinanceApi } from "./CreateBinanceApi.js"
import { DeleteBinanceApi } from "./DeleteBinanceApi.js"

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
