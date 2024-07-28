import { classnames } from "_/classnames"
import { Checkmark, CheckmarkProps } from "_/components/library"
import { formattedMessageMarkup } from "_/i18n/formattedMessageMarkup"
import { BinanceApiKeyPermissionCriteria } from "@workspace/models"
import { PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"

function BinanceApiKeyPermission({
	children,
	ok
}: PropsWithChildren<Pick<CheckmarkProps, "ok">>) {
	if (ok === undefined) return null
	return (
		<div className={classnames("is-flex")}>
			<div>{children}</div>

			<Checkmark ok={ok} />
		</div>
	)
}

function BinanceApiKeyPermissionEnableReading({
	enableReading
}: Partial<Pick<BinanceApiKeyPermissionCriteria, "enableReading">>) {
	return (
		<BinanceApiKeyPermission ok={enableReading}>
			<FormattedMessage
				id="BinanceApiKeyPermissionEnableReading.description"
				values={formattedMessageMarkup}
			/>
		</BinanceApiKeyPermission>
	)
}

function BinanceApiKeyPermissionEnableSpotAndMarginTrading({
	enableSpotAndMarginTrading
}: Partial<
	Pick<BinanceApiKeyPermissionCriteria, "enableSpotAndMarginTrading">
>) {
	return (
		<BinanceApiKeyPermission ok={enableSpotAndMarginTrading}>
			<FormattedMessage
				id="BinanceApiKeyPermissionEnableSpotAndMarginTrading.description"
				values={formattedMessageMarkup}
			/>
		</BinanceApiKeyPermission>
	)
}

function BinanceApiKeyPermissionEnableWithdrawals({
	enableWithdrawals
}: Partial<Pick<BinanceApiKeyPermissionCriteria, "enableWithdrawals">>) {
	return (
		<BinanceApiKeyPermission
			ok={
				typeof enableWithdrawals === "boolean"
					? enableWithdrawals === false
					: undefined
			}
		>
			<FormattedMessage
				id="BinanceApiKeyPermissionEnableWithdrawals.description"
				values={formattedMessageMarkup}
			/>
		</BinanceApiKeyPermission>
	)
}

function BinanceApiKeyPermissionIpRestrict({
	ipRestrict
}: Partial<Pick<BinanceApiKeyPermissionCriteria, "ipRestrict">>) {
	return (
		<BinanceApiKeyPermission ok={ipRestrict}>
			<FormattedMessage
				id="BinanceApiKeyPermissionIpRestrict.description"
				values={formattedMessageMarkup}
			/>
		</BinanceApiKeyPermission>
	)
}

export type BinanceApiKeyPermissionsProps = {
	permissions: BinanceApiKeyPermissionCriteria | undefined
}

export function BinanceApiKeyPermissions({
	permissions
}: BinanceApiKeyPermissionsProps) {
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
