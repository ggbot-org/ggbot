import { Column, Columns } from "_/components/library"
import { BinanceApi } from "_/components/user/BinanceApi.js"
import { CreateBinanceApi } from "_/components/user/CreateBinanceApi.js"
import { DeleteBinanceApi } from "_/components/user/DeleteBinanceApi.js"
import { BinanceApiConfigContext } from "_/contexts/user/BinanceApiConfig.js"
import { FC, useContext } from "react"

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
