import { classNames } from "_/classNames"
import { Box, Flex } from "_/components/library"
import { SchedulingsStatusBadges } from "_/components/user/SchedulingsStatusBadges"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { AccountStrategy } from "@workspace/models"
import { FC } from "react"

type Props = AccountStrategy

export const StrategyItem: FC<Props> = ({
	name,
	schedulings,
	...strategyKey
}) => {
	const onClick = () => {
		GOTO(new URL(webapp.user.strategy(strategyKey)))
	}

	return (
		<Box
			className={classNames("StrategyItem")}
			tabIndex={0}
			onClick={onClick}
		>
			<Flex justify="space-between">
				<span className={classNames("is-unselectable")}>{name}</span>

				<SchedulingsStatusBadges schedulings={schedulings} />
			</Flex>
		</Box>
	)
}
