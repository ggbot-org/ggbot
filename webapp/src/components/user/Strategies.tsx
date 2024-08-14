import { classnames } from "_/classnames"
import { Button, Buttons, Column, Columns, Div, Message, OneColumn, Span } from "_/components/library"
import { SchedulingsStatusBadges, SchedulingsStatusBadgesProps } from "_/components/user/SchedulingsStatusBadges"
import { StrategiesToolbar } from "_/components/user/StrategiesToolbar"
import { useAccountStrategies } from "_/hooks/user/useAccountStrategies"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { localWebStorage } from "_/storages/local"
import { sessionWebStorage } from "_/storages/session"
import { AccountStrategy, schedulingsAreInactive } from "@workspace/models"
import { useEffect, useMemo, useState } from "react"
import { FormattedMessage } from "react-intl"

function StrategyItem({
	isLoading, name, schedulings, ...strategyKey
}: Omit<AccountStrategy, "schedulings"> &
	SchedulingsStatusBadgesProps &
	Partial<{ isLoading: boolean }>) {
	return (
		<Column bulma={["is-half-tablet", "is-one-third-desktop"]}>
			<Div
				bulma={["box", { "is-clickable": !isLoading, "skeleton-block": isLoading }]}
				onClick={() => GOTO(new URL(webapp.user.strategy(strategyKey)))}
				tabIndex={0}
			>
				<Div bulma={["is-flex", "is-justify-content-space-between"]} >
					<Span bulma="is-unselectable">{name}</Span>
					<SchedulingsStatusBadges schedulings={schedulings} />
				</Div>
			</Div>
		</Column>
	)
}

export function Strategies({ goCreateStrategy }: { goCreateStrategy: () => void }) {
	const { accountStrategies, readStrategiesIsPending } = useAccountStrategies()

	const [hideInactive, setHideInactive] = useState<boolean | undefined>(
		localWebStorage.hideInactiveStrategies.get()
	)

	const [estimatedNumItems, setEstimatedNumItems] = useState<number | undefined>(
		sessionWebStorage.estimatedNumStrategies.get() ?? 1
	)

	const { items, numItems } = useMemo(() => {
		const items: AccountStrategy[] = []
		let numItems: number | undefined
		if (accountStrategies) {
			const allAreInactive = accountStrategies.every(({ schedulings }) => schedulingsAreInactive(schedulings))
			for (const item of accountStrategies) {
				const isInactive = schedulingsAreInactive(item.schedulings)
				if (hideInactive && isInactive && !allAreInactive) continue
				items.push(item)
			}
			numItems = items.length
		}
		return { items, numItems }
	}, [accountStrategies, hideInactive])

	useEffect(() => {
		if (numItems === undefined) return
		const estimatedNumItems = numItems ?? 1
		sessionWebStorage.estimatedNumStrategies.set(estimatedNumItems)
		setEstimatedNumItems(estimatedNumItems)
	}, [numItems])

	if (readStrategiesIsPending) return (
		<>
			<StrategiesToolbar isInvisible />
			<Columns isMultiline>
				{[...Array(estimatedNumItems)].map((_, index) => String(index)).map((key) => (
					<StrategyItem
						key={key}
						isLoading
						name=""
						schedulings={undefined}
						strategyId=""
						strategyKind="none"
					/>
				))}
			</Columns>
		</>
	)

	if (accountStrategies?.length === 0) return (
		<OneColumn>
			<form
				className={classnames("box")}
				onSubmit={(event) => {
					event.preventDefault()
					goCreateStrategy()
				}}
			>
				<Message color="info">
					<FormattedMessage id="Strategies.noStrategy" />
				</Message>
				<Buttons>
					<Button>
						<FormattedMessage id="Tabs.newStrategy" />
					</Button>
				</Buttons>
			</form>
		</OneColumn>
	)

	return (
		<>
			<StrategiesToolbar
				hideInactive={hideInactive}
				isInvisible={readStrategiesIsPending}
				setHideInactive={setHideInactive}
			/>
			<Columns isMultiline>
				{items.map((props) => (
					<StrategyItem key={props.strategyId} {...props} />
				))}
			</Columns>
		</>
	)
}
