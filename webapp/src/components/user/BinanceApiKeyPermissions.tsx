import { Classname } from '_/classnames'
import { Checkmark, CheckmarkProps } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { BinanceApiKeyPermissionCriteria } from '@workspace/models'
import { PropsWithChildren } from 'react'

function BinanceApiKeyPermission({ children, ok }: PropsWithChildren<Pick<CheckmarkProps, 'ok'>>) {
	if (ok === undefined) return null
	return (
		<div className={'is-flex' satisfies Classname}>
			<div>{children}</div>
			<Checkmark ok={ok} />
		</div>
	)
}

function BinanceApiKeyPermissionEnableReading({
	enableReading
}: Partial<Pick<BinanceApiKeyPermissionCriteria, 'enableReading'>>) {
	return (
		<BinanceApiKeyPermission ok={enableReading}>
			<FormattedMessage id="BinanceApiKeyPermissionEnableReading.description" />
		</BinanceApiKeyPermission>
	)
}

function BinanceApiKeyPermissionEnableSpotAndMarginTrading({
	enableSpotAndMarginTrading
}: Partial<Pick<BinanceApiKeyPermissionCriteria, 'enableSpotAndMarginTrading'>>) {
	return (
		<BinanceApiKeyPermission ok={enableSpotAndMarginTrading}>
			<FormattedMessage id="BinanceApiKeyPermissionEnableSpotAndMarginTrading.description" />
		</BinanceApiKeyPermission>
	)
}

function BinanceApiKeyPermissionEnableWithdrawals({
	enableWithdrawals
}: Partial<Pick<BinanceApiKeyPermissionCriteria, 'enableWithdrawals'>>) {
	return (
		<BinanceApiKeyPermission
			ok={
				typeof enableWithdrawals === 'boolean'
					? enableWithdrawals === false
					: undefined
			}
		>
			<FormattedMessage id="BinanceApiKeyPermissionEnableWithdrawals.description" />
		</BinanceApiKeyPermission>
	)
}

function BinanceApiKeyPermissionIpRestrict({
	ipRestrict
}: Partial<Pick<BinanceApiKeyPermissionCriteria, 'ipRestrict'>>) {
	return (
		<BinanceApiKeyPermission ok={ipRestrict}>
			<FormattedMessage id="BinanceApiKeyPermissionIpRestrict.description" />
		</BinanceApiKeyPermission>
	)
}

export type BinanceApiKeyPermissionsProps = {
	permissions: BinanceApiKeyPermissionCriteria | undefined
}

export function BinanceApiKeyPermissions({ permissions }: BinanceApiKeyPermissionsProps) {
	if (!permissions) return null

	const {
		enableReading,
		enableWithdrawals,
		enableSpotAndMarginTrading,
		ipRestrict
	} = permissions

	return (
		<div>
			<BinanceApiKeyPermissionEnableReading
				enableReading={enableReading}
			/>
			<BinanceApiKeyPermissionEnableWithdrawals
				enableWithdrawals={enableWithdrawals}
			/>
			<BinanceApiKeyPermissionEnableSpotAndMarginTrading
				enableSpotAndMarginTrading={enableSpotAndMarginTrading}
			/>
			<BinanceApiKeyPermissionIpRestrict ipRestrict={ipRestrict} />
		</div>
	)
}
