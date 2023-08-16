import { Box, Column, Columns, Flex, Message } from "@ggbot2/design"
import { AccountStrategy, isAccountStrategies } from "@ggbot2/models"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

import { SchedulingsStatusBadges } from "../components/SchedulingsStatusBadges.js"
import { AccountStrategiesContext } from "../contexts/AccountStrategies.js"
import { href } from "../routing/hrefs.js"

type StrategyItem = Pick<
	AccountStrategy,
	"strategyId" | "name" | "schedulings"
> & { href: string }

export const Strategies: FC = () => {
	const { accountStrategies } = useContext(AccountStrategiesContext)

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
