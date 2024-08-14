import { classnames } from "_/classnames"
import { Button, Buttons, Column, Columns, Message, OneColumn } from "_/components/library"
import { StrategiesToolbar } from "_/components/user/StrategiesToolbar"
import { StrategyItem } from "_/components/user/StrategyItem"
import { useAccountStrategies } from "_/hooks/user/useAccountStrategies"
import { localWebStorage } from "_/storages/local"
import { sessionWebStorage } from "_/storages/session"
import { AccountStrategy, schedulingsAreInactive } from "@workspace/models"
import { useEffect, useMemo, useState } from "react"
import { FormattedMessage } from "react-intl"

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
					<Column key={key} bulma={["is-half-tablet", "is-one-third-desktop"]}>
						<StrategyItem
							isLoading
							name=""
							schedulings={undefined}
							strategyId=""
							strategyKind="none"
						/>
					</Column>
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
					<Column
						key={props.strategyId}
						bulma={["is-half-tablet", "is-one-third-desktop"]}
					>
						<StrategyItem {...props} />
					</Column>
				))}
			</Columns>
		</>
	)
}
