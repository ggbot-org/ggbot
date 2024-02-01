import { classNames } from "_/classNames"
import {
	Button,
	Buttons,
	Column,
	Columns,
	Form,
	Level,
	LevelItem,
	Title
} from "_/components/library"
import { Memory } from "_/components/Memory"
import {
	SchedulingItem,
	SchedulingItemProps
} from "_/components/SchedulingItem"
import { SchedulingsStatusBadges } from "_/components/SchedulingsStatusBadges"
import { SchedulingsErrorExceededQuota } from "_/components/user/SchedulingsErrorExceededQuota"
import { StrategyContext } from "_/contexts/Strategy"
import { ToastContext } from "_/contexts/Toast"
import { StrategiesContext } from "_/contexts/user/Strategies"
import { useSubscription } from "_/hooks/useSubscription"
import { useUserApi } from "_/hooks/useUserApi"
import {
	isStrategyScheduling,
	newStrategyScheduling,
	StrategyScheduling
} from "@workspace/models"
import {
	FC,
	MouseEventHandler,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const Schedulings: FC = () => {
	const { formatMessage } = useIntl()

	const { strategyId, strategyKey } = useContext(StrategyContext)
	const { hasActiveSubscription } = useSubscription()
	const { accountStrategies, refetchAccountStrategies } =
		useContext(StrategiesContext)
	const { toast } = useContext(ToastContext)

	const WRITE = useUserApi.WriteAccountStrategiesItemSchedulings()
	const isDone = WRITE.isDone
	const isLoading = WRITE.isPending
	const error = WRITE.error

	const [schedulingItems, setSchedulingItems] = useState<
		Array<SchedulingItemProps["scheduling"]>
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
		if (!hasActiveSubscription) {
			toast.warning(
				formatMessage({ id: "Schedulings.noActiveSubscription" })
			)
			return
		}
		setSchedulingItems((schedulingItems) =>
			schedulingItems.concat(
				newStrategyScheduling({
					frequency: { every: 1, interval: "1h" },
					status: "inactive"
				})
			)
		)
	}, [formatMessage, hasActiveSubscription, toast])

	const onClickSave = useCallback(() => {
		if (!strategyKey) return
		if (!hasActiveSubscription) {
			toast.warning(
				formatMessage({ id: "Schedulings.noActiveSubscription" })
			)
			return
		}
		if (!canSave) return
		WRITE.request({
			schedulings: wantedSchedulings,
			...strategyKey
		})
	}, [
		WRITE,
		canSave,
		formatMessage,
		hasActiveSubscription,
		strategyKey,
		toast,
		wantedSchedulings
	])

	const onClickCancel = useCallback<MouseEventHandler>(
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
			<Columns>
				<Column isNarrow>
					<Form
						box
						onSubmit={(event) => {
							event.preventDefault()
						}}
					>
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
											isRounded
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
			</Columns>

			{schedulingItems.map((scheduling) => (
				<Columns key={scheduling.id}>
					<Column isNarrow>
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

					<Column>
						<Memory memory={scheduling.memory} />
					</Column>
				</Columns>
			))}

			<SchedulingsErrorExceededQuota error={error} />
		</>
	)
}
