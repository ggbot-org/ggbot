import {
	Box,
	Button,
	Buttons,
	Checkbox,
	Column,
	Columns,
	Flex,
	Form,
	Message
} from "_/components/library"
import { SchedulingsStatusBadges } from "_/components/SchedulingsStatusBadges"
import { StrategiesContext } from "_/contexts/user/Strategies"
import { webapp } from "_/routing/webapp"
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

type StrategyItem = Pick<
	AccountStrategy,
	"strategyId" | "name" | "schedulings"
> & { href: string }

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

	const items: StrategyItem[] = []
	if (accountStrategies) {
		for (const {
			strategyId,
			strategyKind,
			name,
			schedulings
		} of accountStrategies) {
			const isInactive = schedulingsAreInactive(schedulings)
			if (hideInactive && isInactive && !allAreInactive) continue
			const url = webapp.user.strategy({ strategyId, strategyKind })
			items.push({
				href: `${url.pathname}${url.search}`,
				name,
				schedulings,
				strategyId
			})
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
