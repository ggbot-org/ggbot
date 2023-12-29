import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { Box, Buttons, Column, Columns, Title } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy"
import { StrategyRecord } from "_/components/StrategyRecord"
import { DeleteStrategy } from "_/components/user/DeleteStrategy"
import { RenameStrategy } from "_/components/user/RenameStrategy"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const StrategyActions: FC = () => (
	<Columns>
		<Column
			size={{
				tablet: "full",
				desktop: "one-third",
				fullhd: "two-fifths"
			}}
		>
			<Box>
				<Title>
					<FormattedMessage id="StrategyActions.title" />
				</Title>

				<StrategyRecord />

				<Buttons>
					<RenameStrategy />

					<ShareStrategy />

					<GoCopyStrategy />

					<DeleteStrategy />
				</Buttons>
			</Box>
		</Column>
	</Columns>
)
