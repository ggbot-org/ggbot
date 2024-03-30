import { Box, Flex } from "_/components/library"
import { SchedulingsStatusBadges } from "_/components/user/SchedulingsStatusBadges"
import { GOTO } from "_/routing/navigation"
import { AccountStrategy } from "@workspace/models"
import { FC } from "react"

export type StrategyItemProps = Pick<
	AccountStrategy,
	"name" | "schedulings"
> & { href: string }

export const StrategyItem: FC<StrategyItemProps> = ({
	name,
	href,
	schedulings
}) => (
	<Box
		className="StrategyItem"
		tabIndex={0}
		onClick={() => {
			GOTO(new URL(href))
		}}
	>
		<Flex justify="space-between">
			<span>{name}</span>

			<SchedulingsStatusBadges schedulings={schedulings} />{" "}
		</Flex>
	</Box>
)
