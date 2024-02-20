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
import { SchedulingParameters } from "_/components/user/SchedulingParameters"
import { SchedulingsErrorExceededQuota } from "_/components/user/SchedulingsErrorExceededQuota"
import { StrategyContext } from "_/contexts/Strategy"
import { StrategyFlowContext } from "_/contexts/StrategyFlow"
import { ToastContext } from "_/contexts/Toast"
import { StrategiesContext } from "_/contexts/user/Strategies"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import { useSubscription } from "_/hooks/useSubscription"
import { useUserApi } from "_/hooks/useUserApi"
import {
	extractBinanceParameters,
	extractCommonParameters
} from "@workspace/dflow"
import {
	AccountStrategy,
	isStrategyScheduling,
	newStrategyScheduling,
	StrategyParameters,
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

import { SchedulingParameterItemProps } from "./SchedulingParameterItem"

export const Schedulings: FC = () => {
	const { formatMessage } = useIntl()

	const { strategyId, strategyKey } = useContext(StrategyContext)
	const { flowViewGraph } = useContext(StrategyFlowContext)
	const { hasActiveSubscription } = useSubscription()
	const {
		accountStrategies,
		fetchAccountStrategiesIsPending,
		refetchAccountStrategies
	} = useContext(StrategiesContext)
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
		if (fetchAccountStrategiesIsPending) return
		return currentAccountStrategies
			.filter(
				(accountStrategy) => accountStrategy.strategyId === strategyId
			)
			.reduce<StrategyScheduling[]>(
				(list, accountStrategy) =>
					list.concat(accountStrategy.schedulings),
				[]
			)
	}, [currentAccountStrategies, strategyId, fetchAccountStrategiesIsPending])

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

	const canSave = useMemo(() => {
		if (hasActiveSubscription !== true) return false
		return (
			someSchedulingChanged && schedulingItems.every(isStrategyScheduling)
		)
	}, [someSchedulingChanged, hasActiveSubscription, schedulingItems])

	const binanceSymbols = useBinanceSymbols()

	const paramItems = useCallback<
		(
			params: StrategyParameters | undefined
		) => Array<
			Pick<
				SchedulingParameterItemProps,
				"label" | "value" | "defaultValue"
			>
		>
	>(
		(params = {}) => {
			const items = []
			if (!flowViewGraph) return []

			const commonParams = extractCommonParameters(flowViewGraph)

			for (const { key, defaultValue } of commonParams) {
				const value = params[key]
				items.push({
					label: key,
					defaultValue,
					value
				})
			}

			const binanceParams = binanceSymbols
				? extractBinanceParameters(binanceSymbols, flowViewGraph)
				: []

			for (const { key, defaultValue } of binanceParams) {
				const value = params[key]
				items.push({
					label: key,
					defaultValue,
					value
				})
			}
			return items
		},
		[flowViewGraph, binanceSymbols]
	)

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
					const params = schedulingItem.params ?? {}
					params[key] = value
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
									{currentSchedulings &&
									!fetchAccountStrategiesIsPending ? (
										<SchedulingsStatusBadges
											schedulings={currentSchedulings}
										/>
									) : null}
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
										{fetchAccountStrategiesIsPending ? null : (
											<Button
												isRounded
												onClick={addSchedulingItem}
												size="small"
											>
												<FormattedMessage id="Schedulings.add" />
											</Button>
										)}
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
						<SchedulingParameters
							setParam={setSchedulingParam(scheduling.id)}
							items={paramItems(scheduling.params)}
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
