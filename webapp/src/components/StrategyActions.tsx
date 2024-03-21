import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { GoEditStrategy } from "_/components/GoEditStrategy"
import { Box, Buttons, Columns, OneColumn, Title } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy"
import { StrategyRecord } from "_/components/StrategyRecord"
import { DeleteStrategy } from "_/components/user/DeleteStrategy"
import { RenameStrategy } from "_/components/user/RenameStrategy"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	readOnly: boolean
}

export const StrategyActions: FC<Props> = ({ readOnly }) => (
	<Columns>
		<OneColumn>
			<Box>
				<Title>
					<FormattedMessage id="StrategyActions.title" />
				</Title>

				<StrategyRecord />

				<Buttons>
					{readOnly ? null : <RenameStrategy />}

					<GoCopyStrategy />

					<ShareStrategy />

					{readOnly ? null : (
						<>
							<GoEditStrategy />

							<DeleteStrategy />
						</>
					)}
				</Buttons>
			</Box>
		</OneColumn>
	</Columns>
)
