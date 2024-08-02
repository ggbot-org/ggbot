import { classnames } from "_/classnames"
import {
	Button,
	Buttons,
	Checkbox,
	Column,
	Columns,
	Message
} from "_/components/library"
import { StrategyItem } from "_/components/user/StrategyItem"
import { useAccountStrategies } from "_/hooks/user/useAccountStrategies"
import { localWebStorage } from "_/storages/local"
import { AccountStrategy, schedulingsAreInactive } from "@workspace/models"
import {
	ChangeEventHandler,
	InputHTMLAttributes,
	useCallback,
	useState
} from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	goCreateStrategy: () => void
}

export function Strategies({ goCreateStrategy }: Props) {
	const { accountStrategies } = useAccountStrategies()

	const [hideInactive, setHideInactive] = useState<boolean | undefined>(
		localWebStorage.hideInactiveStrategies.get()
	)

	const allAreInactive = accountStrategies?.every(({ schedulings }) => schedulingsAreInactive(schedulings)
	)

	const items: AccountStrategy[] = []

	if (accountStrategies) {
		for (const item of accountStrategies) {
			const isInactive = schedulingsAreInactive(item.schedulings)
			if (hideInactive && isInactive && !allAreInactive) continue
			items.push(item)
		}
	}

	const onChangeHideInactive = useCallback<
		ChangeEventHandler<HTMLInputElement>
	>((event) => {
		const { checked } =
			event.target as unknown as InputHTMLAttributes<HTMLInputElement>
		setHideInactive(checked)
		localWebStorage.hideInactiveStrategies.set(checked)
	}, [])

	if (accountStrategies === undefined) return null

	if (accountStrategies.length === 0) return (
		<Columns>
			<Column
				bulma={[
					"is-full-tablet",
					"is-three-quarters-widescreen",
					"is-half-fullhd"
				]}
			>
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
			</Column>
		</Columns>
	)

	return (
		<>
			<div className={classnames("is-flex", "mb-5", "ml-3")}>
				<Checkbox
					checked={hideInactive}
					onChange={onChangeHideInactive}
				>
					<FormattedMessage id="Strategies.hideInactive" />
				</Checkbox>
			</div>

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
