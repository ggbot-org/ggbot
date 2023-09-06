import { Box, Column, Columns, Flex, Message } from "_/components/library"
import { SchedulingsStatusBadges } from "_/components/SchedulingsStatusBadges.js"
import { StrategiesContext } from "_/contexts/user/Strategies.js"
import { href } from "_/routing/user/hrefs.js"
import { AccountStrategy, isAccountStrategies } from "@ggbot2/models"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

type StrategyItem = Pick<
	AccountStrategy,
	"strategyId" | "name" | "schedulings"
> & { href: string }

export const Strategies: FC = () => {
	const { accountStrategies } = useContext(StrategiesContext)

	const items: StrategyItem[] = []
	if (isAccountStrategies(accountStrategies)) {
		for (const {
			strategyId,
			strategyKind,
			name,
			schedulings
		} of accountStrategies) {
			items.push({
				href: href.strategyPage({ strategyId, strategyKind }),
				name,
				schedulings,
				strategyId
			})
		}
	}

	return (
		<>
			{accountStrategies === null && (
				<Message color="info">
					<FormattedMessage id="Strategies.noStrategy" />
				</Message>
			)}

			<Columns isMultiline>
				{items.map(({ name, href, schedulings, strategyId }) => (
					<Column
						key={strategyId}
						size={{
							tablet: "half",
							fullhd: "one-third"
						}}
					>
						<a href={href} tabIndex={0}>
							<Box>
								<Flex justify="space-between">
									{name}

									<SchedulingsStatusBadges
										schedulings={schedulings}
									/>
								</Flex>
							</Box>
						</a>
					</Column>
				))}
			</Columns>
		</>
	)
}
