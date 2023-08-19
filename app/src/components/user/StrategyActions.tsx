import { Box, Buttons, Title } from "@ggbot2/design"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

import { StrategyContext } from "../../contexts/user/Strategy.js"
import { GoCopyStrategy } from "../GoCopyStrategy.js"
import { ShareStrategy } from "../ShareStrategy.js"
import { StrategyRecord } from "../StrategyRecord.js"
import { DeleteStrategy } from "./DeleteStrategy.js"
import { RenameStrategy } from "./RenameStrategy.js"

export const StrategyActions: FC = () => {
	const { strategy } = useContext(StrategyContext)

	return (
		<Box>
			<Title>
				<FormattedMessage id="StrategyActions.title" />
			</Title>

			<StrategyRecord strategy={strategy} />

			<Buttons>
				<RenameStrategy />

				<ShareStrategy />

				<GoCopyStrategy />

				<DeleteStrategy />
			</Buttons>
		</Box>
	)
}
