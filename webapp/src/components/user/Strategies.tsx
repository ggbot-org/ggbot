import {
	Button,
	Buttons,
	Checkbox,
	Column,
	Columns,
	Flex,
	Form,
	Message
} from "_/components/library"
import { StrategyItem } from "_/components/user/StrategyItem"
import { StrategiesContext } from "_/contexts/user/Strategies"
import { localWebStorage } from "_/storages/local"
import { AccountStrategy, schedulingsAreInactive } from "@workspace/models"
import {
	ChangeEventHandler,
	FC,
	InputHTMLAttributes,
	useCallback,
	useContext,
	useState
} from "react"
import { FormattedMessage } from "react-intl"
import { FormProps } from "trunx"

export type StrategiesProps = {
	goCreateStrategy: NonNullable<FormProps["onSubmit"]>
}

export const Strategies: FC<StrategiesProps> = ({ goCreateStrategy }) => {
	const { accountStrategies } = useContext(StrategiesContext)

	const [hideInactive, setHideInactive] = useState<boolean | undefined>(
		localWebStorage.hideInactiveStrategies.get()
	)

	const allAreInactive = accountStrategies?.every(({ schedulings }) =>
		schedulingsAreInactive(schedulings)
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

	if (accountStrategies.length === 0)
		return (
			<Columns>
				<Column
					size={{
						tablet: "full",
						widescreen: "three-quarters",
						fullhd: "half"
					}}
				>
					<Form box onSubmit={goCreateStrategy}>
						<Message color="info">
							<FormattedMessage id="Strategies.noStrategy" />
						</Message>

						<Buttons>
							<Button>
								<FormattedMessage id="Tabs.newStrategy" />
							</Button>
						</Buttons>
					</Form>
				</Column>
			</Columns>
		)

	return (
		<>
			<Flex spacing={{ mb: 5, ml: 3 }}>
				<Checkbox
					checked={hideInactive}
					onChange={onChangeHideInactive}
				>
					<FormattedMessage id="Strategies.hideInactive" />
				</Checkbox>
			</Flex>

			<Columns isMultiline>
				{items.map((props) => (
					<Column
						key={props.strategyId}
						size={{
							tablet: "half",
							fullhd: "one-third"
						}}
					>
						<StrategyItem {...props} />
					</Column>
				))}
			</Columns>
		</>
	)
}
