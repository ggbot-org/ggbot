import { useAction, UseActionApiArg } from '_/hooks/useAction'
import { api } from '_/routing/api'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import {
	StripeClientActionInput,
	StripeClientActionOutput,
	StripeClientActionType,
	UserClientActionInput,
	UserClientActionOutput,
	UserClientActionType,
} from '@workspace/api'
import { useEffect } from 'react'

// Stripe Api

const stripeApiOptions: UseActionApiArg = {
	url: api.stripe.action,
	withAuth: true,
}

export function useCreateCheckoutSession() {
	return useAction<
		StripeClientActionType,
		StripeClientActionInput['CreateCheckoutSession'],
		StripeClientActionOutput['CreateCheckoutSession']
	>(stripeApiOptions, 'CreateCheckoutSession')
}

// User Api

const userApiOptions: UseActionApiArg = { url: api.user, withAuth: true }

export function useCopyStrategy() {
	const {
		data: newStrategy,
		isDone,
		...rest
	} = useAction<
		UserClientActionType,
		UserClientActionInput['CopyStrategy'],
		UserClientActionOutput['CopyStrategy']
	>(userApiOptions, 'CopyStrategy')
	useEffect(() => {
		if (!isDone || !newStrategy) return
		GOTO(webapp.user.strategy(newStrategy))
	}, [isDone, newStrategy])
	return { data: newStrategy, isDone, ...rest }
}

export function useCreateBinanceApiConfig() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['CreateBinanceApiConfig'],
		UserClientActionOutput['CreateBinanceApiConfig']
	>(userApiOptions, 'CreateBinanceApiConfig')
}

export function useCreateStrategy() {
	const {
		data: newStrategy,
		isDone,
		...rest
	} = useAction<
		UserClientActionType,
		UserClientActionInput['CreateStrategy'],
		UserClientActionOutput['CreateStrategy']
	>(userApiOptions, 'CreateStrategy')
	useEffect(() => {
		if (!isDone || !newStrategy) return
		GOTO(webapp.user.strategy(newStrategy))
	}, [isDone, newStrategy])
	return { data: newStrategy, isDone, ...rest }
}

export function useDeleteAccount() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['DeleteAccount'],
		UserClientActionOutput['DeleteAccount']
	>(userApiOptions, 'DeleteAccount')
}

export function useDeleteBinanceApiConfig() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['DeleteBinanceApiConfig'],
		UserClientActionOutput['DeleteBinanceApiConfig']
	>(userApiOptions, 'DeleteBinanceApiConfig')
}

export function useDeleteStrategy() {
	const { isDone, ...rest } = useAction<
		UserClientActionType,
		UserClientActionInput['DeleteStrategy'],
		UserClientActionOutput['DeleteStrategy']
	>(userApiOptions, 'DeleteStrategy')
	useEffect(() => {
		if (!isDone) return
		GOTO(webapp.user.dashboard)
	}, [isDone])
	return { isDone, ...rest }
}

export function useReadAccountInfo() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['ReadAccountInfo'],
		UserClientActionOutput['ReadAccountInfo']
	>(userApiOptions, 'ReadAccountInfo')
}

export function useReadBinanceAccountApiRestrictions() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['ReadBinanceAccountApiRestrictions'],
		UserClientActionOutput['ReadBinanceAccountApiRestrictions']
	>(userApiOptions, 'ReadBinanceAccountApiRestrictions')
}

export function useReadBinanceApiKey() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['ReadBinanceApiKey'],
		UserClientActionOutput['ReadBinanceApiKey']
	>(userApiOptions, 'ReadBinanceApiKey')
}

export function useReadStrategies() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['ReadStrategies'],
		UserClientActionOutput['ReadStrategies']
	>(userApiOptions, 'ReadStrategies')
}

export function useReadStrategyErrors() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['ReadStrategyErrors'],
		UserClientActionOutput['ReadStrategyErrors']
	>(userApiOptions, 'ReadStrategyErrors')
}

export function useReadStrategyOrders() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['ReadStrategyOrders'],
		UserClientActionOutput['ReadStrategyOrders']
	>(userApiOptions, 'ReadStrategyOrders')
}

export function useRenameStrategy() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['RenameStrategy'],
		UserClientActionOutput['RenameStrategy']
	>(userApiOptions, 'RenameStrategy')
}

export function useWriteAccountStrategiesItemSchedulings() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['WriteAccountStrategiesItemSchedulings'],
		UserClientActionOutput['WriteAccountStrategiesItemSchedulings']
	>(userApiOptions, 'WriteAccountStrategiesItemSchedulings')
}

export function useWriteStrategyFlow() {
	return useAction<
		UserClientActionType,
		UserClientActionInput['WriteStrategyFlow'],
		UserClientActionOutput['WriteStrategyFlow']
	>(userApiOptions, 'WriteStrategyFlow')
}
