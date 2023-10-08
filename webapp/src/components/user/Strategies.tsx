import {
	Box,
	Checkbox,
	CheckboxOnChange,
	Column,
	Columns,
	Flex,
	Message
} from "_/components/library"
import { SchedulingsStatusBadges } from "_/components/SchedulingsStatusBadges"
import { StrategiesContext } from "_/contexts/user/Strategies"
import { href } from "_/routing/user/hrefs"
import { sessionWebStorage } from "_/storages/session"
import { AccountStrategy } from "@workspace/models"
import { FC, useCallback, useContext, useState } from "react"
import { FormattedMessage } from "react-intl"

type StrategyItem = Pick<
	AccountStrategy,
	"strategyId" | "name" | "schedulings"
> & { href: string }

export const Strategies: FC = () => {
	const { accountStrategies } = useContext(StrategiesContext)
	const [hideInactive, setHideInactive] = useState(
		sessionWebStorage.hideInactiveStrategies.get()
	)
	let numInactive = 0

	const allAreInactive = accountStrategies?.every(
		({ schedulings }) => schedulings.length === 0
	)

	const items: StrategyItem[] = []
	if (accountStrategies) {
		for (const {
			strategyId,
			strategyKind,
			name,
			schedulings
		} of accountStrategies) {
			const isInactive = schedulings.length === 0
			if (isInactive) numInactive++
			if (hideInactive && isInactive && !allAreInactive) continue
			items.push({
				href: href.strategyPage({ strategyId, strategyKind }),
				name,
				schedulings,
				strategyId
			})
		}
	}

	const onChangeHideInactive = useCallback<CheckboxOnChange>((event) => {
		const checked = event.target.checked
		setHideInactive(checked)
		sessionWebStorage.hideInactiveStrategies.set(checked)
	}, [])

	if (accountStrategies === null)
		return (
			<Message color="info">
				<FormattedMessage id="Strategies.noStrategy" />
			</Message>
		)

	return (
		<>
			{!allAreInactive && numInactive > 0 && (
				<Flex spacing={{ mb: 5, ml: 3 }}>
					<Checkbox
						checked={hideInactive}
						onChange={onChangeHideInactive}
					>
						<FormattedMessage id="Strategies.hideInactive" />
					</Checkbox>
				</Flex>
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
