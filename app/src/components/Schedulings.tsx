import {
	Button,
	ButtonOnClick,
	Buttons,
	Column,
	Columns,
	Form,
	FormOnSubmit,
	Level,
	LevelItem,
	Title
} from "@ggbot2/design"
import {
	isStrategyScheduling,
	newStrategyScheduling,
	StrategyScheduling
} from "@ggbot2/models"
import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react"
import { FormattedMessage } from "react-intl"

import {
	SchedulingItem,
	SchedulingItemProps
} from "../components/SchedulingItem.js"
import { SchedulingsErrorExceededQuota } from "../components/SchedulingsErrorExceededQuota.js"
import { SchedulingsStatusBadges } from "../components/SchedulingsStatusBadges.js"
import { AccountStrategiesContext } from "../contexts/AccountStrategies.js"
import { StrategyContext } from "../contexts/Strategy.js"
import { SubscriptionContext } from "../contexts/Subscription.js"
import { useApi } from "../hooks/useApi.js"
import { classNames } from "../styles/classNames.js"

export const Schedulings: FC = () => {
	const {
		strategy: { id: strategyId }
	} = useContext(StrategyContext)
	const { hasActiveSubscription } = useContext(SubscriptionContext)
	const { accountStrategies, refetchAccountStrategies } = useContext(
		AccountStrategiesContext
	)

	const WRITE = useApi.WriteAccountStrategiesItemSchedulings()
	const isDone = WRITE.isDone
	const isLoading = WRITE.isPending
	const error = WRITE.error

	const [schedulingItems, setSchedulingItems] = useState<
		SchedulingItemProps["scheduling"][]
	>([])

	const currentSchedulings = useMemo<StrategyScheduling[]>(() => {
		if (!accountStrategies) return []
		return accountStrategies
			.filter(
				(accountStrategy) => accountStrategy.strategyId === strategyId
			)
			.reduce<StrategyScheduling[]>(
				(list, accountStrategy) =>
					list.concat(accountStrategy.schedulings),
				[]
			)
	}, [accountStrategies, strategyId])

	const someSchedulingChanged = useMemo(() => {
		// Do not know about currentSchedulings yet, data fetch is pending.
		if (!currentSchedulings) return false
		// Some scheduling for sure was added or removed.
		if (schedulingItems.length !== currentSchedulings.length) return true
		// Here the number of schedulingItem and currentSchedulings is the same.
		// Check every schedulingItem:
		for (const schedulingItem of schedulingItems) {
			const currentScheduling = currentSchedulings.find(
				({ id }) => schedulingItem.id === id
			)
			// if there is no corresponding currentScheduling, it is a new item;
			if (!currentScheduling) return true
			// check if schedulingItem is valid, and some of its attribute changed.
			if (
				isStrategyScheduling(schedulingItem) &&
				(schedulingItem.status !== currentScheduling.status ||
					schedulingItem.frequency.every !==
						currentScheduling.frequency.every ||
					schedulingItem.frequency.interval !==
						currentScheduling.frequency.interval)
			)
				return true
		}
		return false
	}, [currentSchedulings, schedulingItems])

	const canCancel = someSchedulingChanged

	const wantedSchedulings = useMemo<StrategyScheduling[]>(
		() => schedulingItems.filter(isStrategyScheduling),
		[schedulingItems]
	)

	const canSave = useMemo(() => {
		if (hasActiveSubscription !== true) return false
		return (
			someSchedulingChanged && schedulingItems.every(isStrategyScheduling)
		)
	}, [someSchedulingChanged, hasActiveSubscription, schedulingItems])

	const setSchedulingItemFrequency = useCallback<
		(id: StrategyScheduling["id"]) => SchedulingItemProps["setFrequency"]
	>(
		(id) => (frequency) => {
			setSchedulingItems((schedulingItems) =>
				schedulingItems.map((schedulingItem) => {
					if (schedulingItem.id !== id) return schedulingItem
					return { ...schedulingItem, frequency }
				})
			)
		},
		[]
	)

	const setSchedulingItemStatus = useCallback<
		(id: StrategyScheduling["id"]) => SchedulingItemProps["setStatus"]
	>(
		(id) => (status) => {
			setSchedulingItems((schedulingItems) =>
				schedulingItems.map((schedulingItem) => {
					if (schedulingItem.id !== id) return schedulingItem
					return { ...schedulingItem, status }
				})
			)
		},
		[]
	)

	const removeSchedulingItem = useCallback<
		(
			id: StrategyScheduling["id"]
		) => SchedulingItemProps["removeScheduling"]
	>(
		(id) => () => {
			setSchedulingItems((schedulingItems) =>
				schedulingItems.filter(
					(schedulingItem) => schedulingItem.id !== id
				)
			)
		},
		[]
	)

	const addSchedulingItem = useCallback(() => {
		setSchedulingItems((schedulingItems) =>
			schedulingItems.concat(
				newStrategyScheduling({
					frequency: { every: 1, interval: "1h" },
					status: "inactive"
				})
			)
		)
	}, [])

	const onClickSave = useCallback<ButtonOnClick>(() => {
		if (!canSave) return
		WRITE.request({
			strategyId: strategyId,
			schedulings: wantedSchedulings
		})
	}, [WRITE, canSave, strategyId, wantedSchedulings])

	const onSubmit = useCallback<FormOnSubmit>((event) => {
		event.preventDefault()
	}, [])

	const onClickCancel = useCallback<ButtonOnClick>(
		(event) => {
			event.preventDefault()
			setSchedulingItems(currentSchedulings)
		},
		[currentSchedulings]
	)

	// Update schedulings once fetched.
	useEffect(() => {
		if (currentSchedulings) setSchedulingItems(currentSchedulings)
	}, [currentSchedulings])

	useEffect(() => {
		if (WRITE.error) WRITE.reset()
	}, [WRITE])

	// Fetch strategies on updates.
	useEffect(() => {
		if (isDone) refetchAccountStrategies()
	}, [refetchAccountStrategies, isDone])

	return (
		<>
			<Columns isMultiline>
				<Column isNarrow>
					<Form box onSubmit={onSubmit}>
						<Level
							isMobile
							left={
								<LevelItem>
									<Title>
										<FormattedMessage id="Schedulings.title" />
									</Title>
								</LevelItem>
							}
							right={
								<LevelItem className={classNames("ml-5")}>
									<SchedulingsStatusBadges
										schedulings={currentSchedulings}
									/>
								</LevelItem>
							}
						/>

						<Level
							left={
								<LevelItem>
									<Buttons>
										<Button
											onClick={onClickSave}
											color={
												canSave ? "primary" : undefined
											}
											isLoading={isLoading}
										>
											<FormattedMessage id="Schedulings.save" />
										</Button>

										<Button
											onClick={onClickCancel}
											disabled={!canCancel}
										>
											<FormattedMessage id="Schedulings.cancel" />
										</Button>
									</Buttons>
								</LevelItem>
							}
							right={
								<LevelItem>
									<Buttons>
										<Button
											onClick={addSchedulingItem}
											size="small"
										>
											<FormattedMessage id="Schedulings.add" />
										</Button>
									</Buttons>
								</LevelItem>
							}
						/>
					</Form>
				</Column>

				{schedulingItems.map((scheduling) => (
					<Column key={scheduling.id} isNarrow>
						<SchedulingItem
							scheduling={scheduling}
							setFrequency={setSchedulingItemFrequency(
								scheduling.id
							)}
							setStatus={setSchedulingItemStatus(scheduling.id)}
							removeScheduling={removeSchedulingItem(
								scheduling.id
							)}
						/>
					</Column>
				))}
			</Columns>

			<SchedulingsErrorExceededQuota error={error} />
		</>
	)
}
