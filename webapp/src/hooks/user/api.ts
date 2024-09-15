import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { useOrdersIDB } from "_/hooks/user/indexedDBs"
import { api } from "_/routing/api"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StripeClientActionInput, StripeClientActionOutput, StripeClientActionType, UserClientActionInput, UserClientActionOutput, UserClientActionType } from "@workspace/api"
import { StrategyKey } from "@workspace/models"
import { dateToDay, Day, DayInterval, dayToDate, getDate, getDay, timeToDay, today } from "minimal-time-helpers"
import { useCallback, useEffect, useState } from "react"

// Stripe Api

const stripeApiOptions: UseActionApiArg = { url: api.stripe.action, withAuth: true }

export function useCreateCheckoutSession() {
	return useAction<StripeClientActionType, StripeClientActionInput["CreateCheckoutSession"], StripeClientActionOutput["CreateCheckoutSession"]>(stripeApiOptions, "CreateCheckoutSession")
}

// User Api

const userApiOptions: UseActionApiArg = { url: api.user.action, withAuth: true }

export function useCopyStrategy() {
	const { data: newStrategy, isDone, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput["CopyStrategy"],
		UserClientActionOutput["CopyStrategy"]
	>(userApiOptions, "CopyStrategy")
	useEffect(() => {
		if (!isDone || !newStrategy) return
		GOTO(webapp.user.strategy(newStrategy))
	}, [isDone, newStrategy])
	return { data: newStrategy, isDone, ...rest }
}

export function useCreateBinanceApiConfig() {
	return useAction<UserClientActionType, UserClientActionInput["CreateBinanceApiConfig"], UserClientActionOutput["CreateBinanceApiConfig"]>(userApiOptions, "CreateBinanceApiConfig")
}

export function useCreateStrategy() {
	const { data: newStrategy, isDone, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput["CreateStrategy"],
		UserClientActionOutput["CreateStrategy"]
	>(userApiOptions, "CreateStrategy")
	useEffect(() => {
		if (!isDone || !newStrategy) return
		GOTO(webapp.user.strategy(newStrategy))
	}, [isDone, newStrategy])
	return { data: newStrategy, isDone, ...rest }
}

export function useDeleteAccount() {
	return useAction<UserClientActionType, UserClientActionInput["DeleteAccount"], UserClientActionOutput["DeleteAccount"]>(userApiOptions, "DeleteAccount")
}

export function useDeleteBinanceApiConfig() {
	return useAction<UserClientActionType, UserClientActionInput["DeleteBinanceApiConfig"], UserClientActionOutput["DeleteBinanceApiConfig"]>(userApiOptions, "DeleteBinanceApiConfig")
}

export function useDeleteStrategy() {
	const { isDone, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput["DeleteStrategy"],
		UserClientActionOutput["DeleteStrategy"]
	>(userApiOptions, "DeleteStrategy")
	useEffect(() => {
		if (!isDone) return
		GOTO(webapp.user.dashboard)
	}, [isDone])
	return { isDone, ...rest }
}

export function useReadAccountInfo() {
	return useAction<UserClientActionType, UserClientActionInput["ReadAccountInfo"], UserClientActionOutput["ReadAccountInfo"]>(userApiOptions, "ReadAccountInfo")
}

export function useReadBinanceAccountApiRestrictions() {
	return useAction<UserClientActionType, UserClientActionInput["ReadBinanceAccountApiRestrictions"], UserClientActionOutput["ReadBinanceAccountApiRestrictions"]>(userApiOptions, "ReadBinanceAccountApiRestrictions")
}

export function useReadBinanceApiKey() {
	return useAction<UserClientActionType, UserClientActionInput["ReadBinanceApiKey"], UserClientActionOutput["ReadBinanceApiKey"]>(userApiOptions, "ReadBinanceApiKey")
}

export function useReadStrategies() {
	return useAction<UserClientActionType, UserClientActionInput["ReadStrategies"], UserClientActionOutput["ReadStrategies"]>(userApiOptions, "ReadStrategies")
}

export function useReadStrategyErrors() {
	return useAction<UserClientActionType, UserClientActionInput["ReadStrategyErrors"], UserClientActionOutput["ReadStrategyErrors"]>(userApiOptions, "ReadStrategyErrors")
}

/*
TODO

export function useReadStrategyOrders() {
	return useAction<UserClientActionType, UserClientActionInput["ReadStrategyOrders"], UserClientActionOutput["ReadStrategyOrders"]>(userApiOptions, "ReadStrategyOrders")
}

*/

export function useReadStrategyOrders(strategyKey: StrategyKey | undefined) {
	const { db, dbIsOpen } = useOrdersIDB()
	const [toBeCachedDayInterval, setToBeCachedDayInterval] = useState<DayInterval | undefined>()
	const [data, setData] = useState<UserClientActionOutput["ReadStrategyOrders"] | undefined>()
	const { data: requestData, request, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput["ReadStrategyOrders"],
		UserClientActionOutput["ReadStrategyOrders"]
	>(userApiOptions, "ReadStrategyOrders")
	const requestWithCache = useCallback(
		({ start, end, ...strategyKey }: UserClientActionInput["ReadStrategyOrders"]) => {
			if (!dbIsOpen) return
			(async () => {
				try {
					const cachedData: UserClientActionOutput["ReadStrategyOrders"] = []
					let date = dayToDate(start)
					let allDataIsCached = true
					while (date <= dayToDate(end)) {
						const dailyResult = await db.readDailyOrders(strategyKey, dateToDay(date))
						if (!dailyResult) {
							allDataIsCached = false
							break
						}
						cachedData.push(...dailyResult)
						date = getDate(date).plusOne.day
					}
					if (allDataIsCached) {
						setData(cachedData)
					} else {
						// Never cache current day.
						const maxDay = today()
						const start = dateToDay(date)
						if (start < maxDay) setToBeCachedDayInterval({
							start,
							end: end === today() ? getDay(end).minus(1).days : end
						})
						// Fetch missing data.
						request({ start, end, ...strategyKey })
					}
				} catch (error) {
					console.debug(error)
				}
			})()
		},
		[request, db, dbIsOpen]
	)
	useEffect(() => {
		if (!strategyKey) return
		if (!requestData) return
		// Write to cache.
		if (!toBeCachedDayInterval) return
		const toBeCachedDailyResults = new Map<Day, UserClientActionOutput["ReadStrategyOrders"]>()
		let date = dayToDate(toBeCachedDayInterval.start)
		while (date <= dayToDate(toBeCachedDayInterval.end)) {
			toBeCachedDailyResults.set(dateToDay(date), [])
			date = getDate(date).plusOne.day
		}
		for (const item of requestData) {
			const day = timeToDay(item.whenCreated)
			toBeCachedDailyResults.get(day)?.push(item)
		}
		for (const [day, data] of toBeCachedDailyResults) {
			db.writeDailyOrders(strategyKey, day, data)
		}
		// Set data and reset request.
		setData((data) => data === undefined ? requestData : [...data, ...requestData])
	}, [db, requestData, strategyKey, toBeCachedDayInterval])
	return { data, request: requestWithCache, ...rest }
}

export function useRenameStrategy() {
	return useAction<UserClientActionType, UserClientActionInput["RenameStrategy"], UserClientActionOutput["RenameStrategy"]>(userApiOptions, "RenameStrategy")
}

export function useWriteAccountStrategiesItemSchedulings() {
	return useAction<UserClientActionType, UserClientActionInput["WriteAccountStrategiesItemSchedulings"], UserClientActionOutput["WriteAccountStrategiesItemSchedulings"]>(userApiOptions, "WriteAccountStrategiesItemSchedulings")
}

export function useWriteStrategyFlow() {
	return useAction<UserClientActionType, UserClientActionInput["WriteStrategyFlow"], UserClientActionOutput["WriteStrategyFlow"]>(userApiOptions, "WriteStrategyFlow")
}
