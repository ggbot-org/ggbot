import { classnames } from "_/classnames"
import {
	Button,
	Buttons,
	Column,
	Columns,
	Level,
	LevelItem,
	Title
} from "_/components/library"
import { Memory } from "_/components/Memory"
import {
	SchedulingItem,
	SchedulingItemProps
} from "_/components/user/SchedulingItem"
import { SchedulingParameters } from "_/components/user/SchedulingParameters"
import { SchedulingsErrorExceededQuota } from "_/components/user/SchedulingsErrorExceededQuota"
import { SchedulingsStatusBadges } from "_/components/user/SchedulingsStatusBadges"
import { ToastContext } from "_/contexts/Toast"
import { useAccountStrategies } from "_/hooks/useAccountStrategies"
import { useUserApi } from "_/hooks/userApi"
import { useStrategyFlow } from "_/hooks/useStrategyFlow"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { useSubscription } from "_/hooks/useSubscription"
import {
	AccountStrategy,
	isStrategyScheduling,
	newStrategyScheduling,
	PRO_FREQUENCY_INTERVALS,
	StrategyScheduling
} from "@workspace/models"
import {
	MouseEventHandler,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { SchedulingParameterItemProps } from "./SchedulingParameterItem"

export function Schedulings() {
	const { formatMessage } = useIntl()

	const strategyKey = useStrategyKey()
	const strategyId = strategyKey?.strategyId

	const flowViewGraph = useStrategyFlow(strategyKey)

	const { hasActiveSubscription, isPro } = useSubscription()
	const { accountStrategies, resetAccountStrategies } = useAccountStrategies()
	const { toast } = useContext(ToastContext)

	const [currentAccountStrategies, setCurrentAccountStrategies] = useState<
		AccountStrategy[]
	>([])

	const WRITE = useUserApi.WriteAccountStrategiesItemSchedulings()
	const isDone = WRITE.isDone
	const isLoading = WRITE.isPending
	const error = WRITE.error

	const [schedulingItems, setSchedulingItems] = useState<
		Array<SchedulingItemProps["scheduling"]>
	>([])

	const currentSchedulings = useMemo<StrategyScheduling[] | undefined>(() => {
		if (currentAccountStrategies === undefined) return
		return currentAccountStrategies
			.filter(
				(accountStrategy) => accountStrategy.strategyId === strategyId
			)
			.reduce<
				StrategyScheduling[]
			>((list, accountStrategy) => list.concat(accountStrategy.schedulings), [])
	}, [currentAccountStrategies, strategyId])

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
			// Compare startegy params.
			if (currentScheduling.params === undefined && schedulingItem.params)
				return true
			if (currentScheduling.params && schedulingItem.params === undefined)
				return true
			if (currentScheduling.params && schedulingItem.params) {
				if (
					Object.keys(currentScheduling.params).length !==
					Object.keys(schedulingItem.params).length
				)
					return true
				for (const key in currentScheduling.params)
					if (
						currentScheduling.params[key] !==
						schedulingItem.params[key]
					)
						return true
			}
		}
		return false
	}, [currentSchedulings, schedulingItems])

	const canCancel = someSchedulingChanged

	const wantedSchedulings = useMemo<StrategyScheduling[]>(
		() => schedulingItems.filter(isStrategyScheduling),
		[schedulingItems]
	)

	const canSave =
		someSchedulingChanged && schedulingItems.every(isStrategyScheduling)

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

	const setSchedulingParam = useCallback<
		(
			id: StrategyScheduling["id"]
		) => SchedulingParameterItemProps["setParam"]
	>(
		(id) => (key, value) => {
			setSchedulingItems((schedulingItems) =>
				schedulingItems.map((schedulingItem) => {
					if (schedulingItem.id !== id) return schedulingItem
					const params = Object.assign({}, schedulingItem.params)
					if (value === undefined) {
						delete params[key]
					} else {
						params[key] = value
					}
					return { ...schedulingItem, params }
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
		if (!canSave) return
		WRITE.request({
			schedulings: wantedSchedulings,
			...strategyKey
		})
	}, [WRITE, canSave, strategyKey, wantedSchedulings])

	const onClickCancel = useCallback<MouseEventHandler>(
		(event) => {
			event.preventDefault()
			if (!currentSchedulings) return
			setSchedulingItems(currentSchedulings)
		},
		[currentSchedulings]
	)

	// Update accountStrategies once fetched.
	useEffect(() => {
		if (!accountStrategies) return
		setCurrentAccountStrategies(accountStrategies)
	}, [accountStrategies, setCurrentAccountStrategies])

	// Update schedulings once fetched.
	useEffect(() => {
		if (currentSchedulings) setSchedulingItems(currentSchedulings)
	}, [currentSchedulings])

	useEffect(() => {
		if (WRITE.error) WRITE.reset()
	}, [WRITE])

	// Reset strategies once done.
	useEffect(() => {
		if (isDone) resetAccountStrategies()
	}, [resetAccountStrategies, isDone])

	return (
		<>
			<Columns>
				<Column
					bulma={[
						"is-narrow",
						{ "is-skeleton": accountStrategies === undefined }
					]}
				>
					<form
						className={classnames("box")}
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
								<LevelItem className={classnames("ml-5")}>
									<SchedulingsStatusBadges
										schedulings={currentSchedulings}
									/>{" "}
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
					</form>
				</Column>
			</Columns>

			{schedulingItems.map((scheduling) => (
				<Columns key={scheduling.id}>
					<Column bulma="is-narrow">
						<SchedulingItem
							disabledIntervalOptions={
								isPro ? [] : PRO_FREQUENCY_INTERVALS
							}
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
						<SchedulingParameters
							flowViewGraph={flowViewGraph}
							setParam={setSchedulingParam(scheduling.id)}
							params={scheduling.params}
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
