import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { GoEditStrategy } from "_/components/GoEditStrategy"
import { Box, Buttons, Title } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy"
import { StrategyRecord } from "_/components/StrategyRecord"
import { DeleteStrategy } from "_/components/user/DeleteStrategy"
import { RenameStrategy } from "_/components/user/RenameStrategy"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const StrategyActions: FC = () => (
	<Box>
		<Title>
			<FormattedMessage id="StrategyActions.title" />
		</Title>

		<StrategyRecord />

		<Buttons>
			<RenameStrategy />

			<ShareStrategy />

			<GoEditStrategy />

			<GoCopyStrategy />

			<DeleteStrategy />
		</Buttons>
	</Box>
)
