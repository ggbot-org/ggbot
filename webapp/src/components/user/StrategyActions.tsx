import { GoCopyStrategy } from "_/components/GoCopyStrategy.js"
import { Box, Buttons, Title } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy.js"
import { StrategyRecord } from "_/components/StrategyRecord.js"
import { DeleteStrategy } from "_/components/user/DeleteStrategy.js"
import { RenameStrategy } from "_/components/user/RenameStrategy.js"
import { StrategyContext } from "_/contexts/user/Strategy.js"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

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
