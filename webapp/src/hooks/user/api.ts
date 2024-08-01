import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { useAccountStrategies } from "_/hooks/user/useAccountStrategies"
import { useStrategy } from "_/hooks/useStrategy"
import { api } from "_/routing/api"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { errorsIDB, ordersIDB } from "_/storages/indexedDBs"
import {
	StripeClientActionInput,
	StripeClientActionOutput,
	StripeClientActionType,
	UserClientActionInput,
	UserClientActionOutput,
	UserClientActionType
} from "@workspace/api"
import { StrategyKey } from "@workspace/models"
import {
	dateToDay,
	Day,
	DayInterval,
	dayToDate,
	getDate,
	getDay,
	timeToDay,
	today
} from "minimal-time-helpers"
import { useCallback, useEffect, useState } from "react"

// Stripe Api

const stripeApiOptions: UseActionApiArg = {
	url: api.stripe.action,
	withAuth: true
}

export function useCreateCheckoutSession() {
	return useAction<
		StripeClientActionType,
		StripeClientActionInput["CreateCheckoutSession"],
		StripeClientActionOutput["CreateCheckoutSession"]
	>(stripeApiOptions, "CreateCheckoutSession")
}

// User Api

const userApiOptions: UseActionApiArg = {
	url: api.user.action,
	withAuth: true
}

export function useCopyStrategy() {
	const { resetAccountStrategies } = useAccountStrategies()
	const {
		data: newStrategy,
		isDone,
		...rest
	} = useAction<
		UserClientActionType,
		UserClientActionInput["CopyStrategy"],
		UserClientActionOutput["CopyStrategy"]
	>(userApiOptions, "CopyStrategy")
	useEffect(() => {
		if (!isDone || !newStrategy) return
		resetAccountStrategies()
		GOTO(webapp.user.strategy(newStrategy))
	}, [isDone, newStrategy, resetAccountStrategies])
	return { data: newStrategy, isDone, ...rest }
}

export function useCreateBinanceApiConfig() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["CreateBinanceApiConfig"],
		UserClientActionOutput["CreateBinanceApiConfig"]
	>(userApiOptions, "CreateBinanceApiConfig")
}

export function useCreateStrategy() {
	const { resetAccountStrategies } = useAccountStrategies()
	const {
		data: newStrategy,
		isDone,
		...rest
	} = useAction<
		UserClientActionType,
		UserClientActionInput["CreateStrategy"],
		UserClientActionOutput["CreateStrategy"]
	>(userApiOptions, "CreateStrategy")
	useEffect(() => {
		if (!isDone || !newStrategy) return
		resetAccountStrategies()
		GOTO(webapp.user.strategy(newStrategy))
	}, [isDone, newStrategy, resetAccountStrategies])
	return { data: newStrategy, isDone, ...rest }
}

export function useDeleteAccount() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["DeleteAccount"],
		UserClientActionOutput["DeleteAccount"]
	>(userApiOptions, "DeleteAccount")
}

export function useDeleteBinanceApiConfig() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["DeleteBinanceApiConfig"],
		UserClientActionOutput["DeleteBinanceApiConfig"]
	>(userApiOptions, "DeleteBinanceApiConfig")
}

export function useDeleteStrategy(strategyKey: StrategyKey | undefined) {
	const { resetAccountStrategies } = useAccountStrategies()
	const { resetStrategy } = useStrategy(strategyKey)
	const { isDone, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput["DeleteStrategy"],
		UserClientActionOutput["DeleteStrategy"]
	>(userApiOptions, "DeleteStrategy")
	useEffect(() => {
		if (!isDone) return
		resetAccountStrategies()
		resetStrategy()
		GOTO(webapp.user.dashboard)
	}, [isDone, resetAccountStrategies, resetStrategy])
	return { isDone, ...rest }
}

export function useReadAccountInfo() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["ReadAccountInfo"],
		UserClientActionOutput["ReadAccountInfo"]
	>(userApiOptions, "ReadAccountInfo")
}

export function useReadBinanceAccountApiRestrictions() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["ReadBinanceAccountApiRestrictions"],
		UserClientActionOutput["ReadBinanceAccountApiRestrictions"]
	>(userApiOptions, "ReadBinanceAccountApiRestrictions")
}

export function useReadBinanceApiKey() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["ReadBinanceApiKey"],
		UserClientActionOutput["ReadBinanceApiKey"]
	>(userApiOptions, "ReadBinanceApiKey")
}

export function useReadStrategies() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["ReadStrategies"],
		UserClientActionOutput["ReadStrategies"]
	>(userApiOptions, "ReadStrategies")
}

export function useReadStrategyErrors(strategyKey: StrategyKey | undefined) {
	const [toBeCachedDayInterval, setToBeCachedDayInterval] = useState<
		DayInterval | undefined
	>()
	const [data, setData] = useState<
		UserClientActionOutput["ReadStrategyErrors"]
	>([])
	const {
		request,
		data: requestData,
		...rest
	} = useAction<
		UserClientActionType,
		UserClientActionInput["ReadStrategyErrors"],
		UserClientActionOutput["ReadStrategyErrors"]
	>(userApiOptions, "ReadStrategyErrors")
	const cachedRequest = useCallback(
		({
			start,
			end,
			...strategyKey
		}: UserClientActionInput["ReadStrategyErrors"]) => {
			;(async () => {
				const cachedData: UserClientActionOutput["ReadStrategyErrors"] =
					[]
				let date = dayToDate(start)
				let allDataIsCached = true
				while (date <= dayToDate(end)) {
					const dailyResult = await errorsIDB.readDailyErrors(
						strategyKey,
						dateToDay(date)
					)
					if (!dailyResult) {
						allDataIsCached = false
						break
					}
					cachedData.push(...dailyResult)
					date = getDate(date).plusOne.day
				}
				setData(cachedData)
				if (!allDataIsCached) {
					// Never cache current day.
					const maxDay = today()
					const start = dateToDay(date)
					if (start < maxDay)
						setToBeCachedDayInterval({
							start,
							end:
								end === today()
									? getDay(end).minus(1).days
									: end
						})
					// Fetch missing data.
					await request({
						start,
						end,
						...strategyKey
					})
				}
			})()
		},
		[request]
	)
	useEffect(() => {
		if (!strategyKey) return
		if (!requestData) return
		setData((data) => [...data, ...requestData])
		// Write to cache.
		if (!toBeCachedDayInterval) return
		const toBeCachedDailyResults = new Map<
			Day,
			UserClientActionOutput["ReadStrategyErrors"]
		>()
		let date = dayToDate(toBeCachedDayInterval.start)
		while (date <= dayToDate(toBeCachedDayInterval.end)) {
			toBeCachedDailyResults.set(dateToDay(date), [])
			date = getDate(date).plusOne.day
		}
		for (const item of requestData) {
			const day = timeToDay(item.whenCreated)
			toBeCachedDailyResults.get(day)?.push(item)
		}
		for (const [day, data] of toBeCachedDailyResults)
			errorsIDB.writeDailyErrors(strategyKey, day, data)
	}, [requestData, strategyKey, toBeCachedDayInterval])
	return {
		data,
		request: cachedRequest,
		...rest
	}
}

export function useReadStrategyOrders(strategyKey: StrategyKey | undefined) {
	const [toBeCachedDayInterval, setToBeCachedDayInterval] = useState<
		DayInterval | undefined
	>()
	const [data, setData] = useState<
		UserClientActionOutput["ReadStrategyOrders"]
	>([])
	const {
		request,
		data: requestData,
		...rest
	} = useAction<
		UserClientActionType,
		UserClientActionInput["ReadStrategyOrders"],
		UserClientActionOutput["ReadStrategyOrders"]
	>(userApiOptions, "ReadStrategyOrders")
	const cachedRequest = useCallback(
		({
			start,
			end,
			...strategyKey
		}: UserClientActionInput["ReadStrategyOrders"]) => {
			;(async () => {
				const cachedData: UserClientActionOutput["ReadStrategyOrders"] =
					[]
				let date = dayToDate(start)
				let allDataIsCached = true
				while (date <= dayToDate(end)) {
					const dailyResult = await ordersIDB.readDailyOrders(
						strategyKey,
						dateToDay(date)
					)
					if (!dailyResult) {
						allDataIsCached = false
						break
					}
					cachedData.push(...dailyResult)
					date = getDate(date).plusOne.day
				}
				setData(cachedData)
				if (!allDataIsCached) {
					// Never cache current day.
					const maxDay = today()
					const start = dateToDay(date)
					if (start < maxDay)
						setToBeCachedDayInterval({
							start,
							end:
								end === today()
									? getDay(end).minus(1).days
									: end
						})
					// Fetch missing data.
					await request({
						start,
						end,
						...strategyKey
					})
				}
			})()
		},
		[request]
	)
	useEffect(() => {
		if (!strategyKey) return
		if (!requestData) return
		setData((data) => [...data, ...requestData])
		// Write to cache.
		if (!toBeCachedDayInterval) return
		const toBeCachedDailyResults = new Map<
			Day,
			UserClientActionOutput["ReadStrategyOrders"]
		>()
		let date = dayToDate(toBeCachedDayInterval.start)
		while (date <= dayToDate(toBeCachedDayInterval.end)) {
			toBeCachedDailyResults.set(dateToDay(date), [])
			date = getDate(date).plusOne.day
		}
		for (const item of requestData) {
			const day = timeToDay(item.whenCreated)
			toBeCachedDailyResults.get(day)?.push(item)
		}
		for (const [day, data] of toBeCachedDailyResults)
			ordersIDB.writeDailyOrders(strategyKey, day, data)
	}, [requestData, strategyKey, toBeCachedDayInterval])
	return {
		data,
		request: cachedRequest,
		...rest
	}
}

export function useRenameStrategy(strategyKey: StrategyKey | undefined) {
	const { resetAccountStrategies } = useAccountStrategies()
	const { resetStrategy } = useStrategy(strategyKey)
	const { isDone, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput["RenameStrategy"],
		UserClientActionOutput["RenameStrategy"]
	>(userApiOptions, "RenameStrategy")
	useEffect(() => {
		if (!isDone) return
		resetAccountStrategies()
		resetStrategy()
	}, [isDone, resetAccountStrategies, resetStrategy])
	return { isDone, ...rest }
}

export function useWriteAccountStrategiesItemSchedulings() {
	const { resetAccountStrategies } = useAccountStrategies()
	const { isDone, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput["WriteAccountStrategiesItemSchedulings"],
		UserClientActionOutput["WriteAccountStrategiesItemSchedulings"]
	>(userApiOptions, "WriteAccountStrategiesItemSchedulings")
	useEffect(() => {
		if (isDone) resetAccountStrategies()
	}, [resetAccountStrategies, isDone])
	return { isDone, ...rest }
}

export function useWriteStrategyFlow() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["WriteStrategyFlow"],
		UserClientActionOutput["WriteStrategyFlow"]
	>(userApiOptions, "WriteStrategyFlow")
}
