import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { GoEditStrategy } from "_/components/GoEditStrategy"
import { Box, Buttons, Columns, OneColumn, Title } from "_/components/library"
import { ShareStrategy, ShareStrategyProps } from "_/components/ShareStrategy"
import { StrategyRecord } from "_/components/StrategyRecord"
import { DeleteStrategy } from "_/components/user/DeleteStrategy"
import { RenameStrategy } from "_/components/user/RenameStrategy"
import { StrategyContext } from "_/contexts/Strategy"
import { useContext } from "react"
import { FormattedMessage } from "react-intl"

type Props = ShareStrategyProps & {
	readOnly: boolean
}

export function StrategyActions({ readOnly }: Props) {
	const { strategyKey, strategyName } = useContext(StrategyContext)

	return (
		<Columns>
			<OneColumn>
				<Box>
					<Title>
						<FormattedMessage id="StrategyActions.title" />
					</Title>

					<StrategyRecord />

					<Buttons>
						{readOnly ? null : <RenameStrategy />}

						<GoCopyStrategy strategyKey={strategyKey} />

						<ShareStrategy
							strategyKey={strategyKey}
							strategyName={strategyName}
						/>

						{readOnly ? null : (
							<>
								<GoEditStrategy strategyKey={strategyKey} />

								<DeleteStrategy strategyKey={strategyKey} />
							</>
						)}
					</Buttons>
				</Box>
			</OneColumn>
		</Columns>
	)
}
