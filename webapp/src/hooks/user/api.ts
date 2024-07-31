import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { useAccountStrategies } from "_/hooks/user/useAccountStrategies"
import { api } from "_/routing/api"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { errorsIDB } from "_/storages/indexedDBs"
import {
	StripeClientActionInput,
	StripeClientActionOutput,
	StripeClientActionType,
	UserClientActionInput,
	UserClientActionOutput,
	UserClientActionType
} from "@workspace/api"
import {
	dateToDay,
	Day,
	dayToDate,
	getDate,
	timeToDay
} from "minimal-time-helpers"
import { useEffect, useState } from "react"

import { useStrategyKey } from "../useStrategyKey"

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

export function useDeleteStrategy() {
	const { resetAccountStrategies } = useAccountStrategies()
	const { isDone, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput["DeleteStrategy"],
		UserClientActionOutput["DeleteStrategy"]
	>(userApiOptions, "DeleteStrategy")
	useEffect(() => {
		if (!isDone) return
		resetAccountStrategies()
		GOTO(webapp.user.dashboard)
	}, [isDone, resetAccountStrategies])
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

export function useReadStrategyErrors() {
	const [data, setData] = useState<
		UserClientActionOutput["ReadStrategyErrors"]
	>([])
	const strategyKey = useStrategyKey()
	const {
		request,
		data: requestData,
		...rest
	} = useAction<
		UserClientActionType,
		UserClientActionInput["ReadStrategyErrors"],
		UserClientActionOutput["ReadStrategyErrors"]
	>(userApiOptions, "ReadStrategyErrors")
	useEffect(() => {
		if (!strategyKey) return
		if (!requestData) return
		setData((data) => [...data, ...requestData])
		// Write to cache.
		const dailyResults = new Map<
			Day,
			UserClientActionOutput["ReadStrategyErrors"]
		>()
		for (const item of requestData) {
			const day = timeToDay(item.whenCreated)
			if (dailyResults.has(day)) dailyResults.get(day)!.push(item)
			else dailyResults.set(day, [item])
		}
		for (const [day, data] of dailyResults) {
			errorsIDB.writeDailyErrors(strategyKey, day, data)
		}
	}, [requestData, strategyKey])
	return {
		data,
		async request({
			start,
			end,
			...strategyKey
		}: UserClientActionInput["ReadStrategyErrors"]): Promise<void> {
			const cachedData: UserClientActionOutput["ReadStrategyErrors"] = []
			let date = dayToDate(start)
			let someDataIsNotCached = false
			while (date <= dayToDate(end)) {
				const dailyResult = await errorsIDB.readDailyErrors(
					strategyKey,
					dateToDay(date)
				)
				if (!dailyResult) {
					someDataIsNotCached = true
					continue
				}
				cachedData.push(...dailyResult)
				date = getDate(date).plusOne.day
			}
			setData(cachedData)
			if (someDataIsNotCached)
				await request({
					start: dateToDay(date),
					end,
					...strategyKey
				})
		},
		...rest
	}
}

export function useReadStrategyOrders() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["ReadStrategyOrders"],
		UserClientActionOutput["ReadStrategyOrders"]
	>(userApiOptions, "ReadStrategyOrders")
}

export function useRenameStrategy() {
	return useAction<
		UserClientActionType,
		UserClientActionInput["RenameStrategy"],
		UserClientActionOutput["RenameStrategy"]
	>(userApiOptions, "RenameStrategy")
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
