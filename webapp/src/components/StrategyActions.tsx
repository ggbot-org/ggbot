import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { GoEditStrategy } from "_/components/GoEditStrategy"
import { Buttons, Columns, Div, OneColumn, Title } from "_/components/library"
import { ShareStrategy, ShareStrategyProps } from "_/components/ShareStrategy"
import { StrategyRecord } from "_/components/StrategyRecord"
import { DeleteStrategy } from "_/components/user/DeleteStrategy"
import { RenameStrategy } from "_/components/user/RenameStrategy"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { FormattedMessage } from "react-intl"

type Props = ShareStrategyProps & {
	readOnly: boolean
}

export function StrategyActions({ readOnly }: Props) {
	const { strategyKey } = useStrategyKey()
	const { strategyName } = useStrategy(strategyKey)

	return (
		<Columns>
			<OneColumn>
				<Div bulma="box">
					<Title>
						<FormattedMessage id="StrategyActions.title" />
					</Title>

					<StrategyRecord strategyKey={strategyKey} />

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
				</Div>
			</OneColumn>
		</Columns>
	)
}
