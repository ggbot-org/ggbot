import { Checkmark, CheckmarkProps, Flex } from "_/components/library"
import { BinanceApiKeyPermissionCriteria } from "@workspace/models"
import { FC, PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"

type BinanceApiKeyPermissionProps = Pick<CheckmarkProps, "ok">

const BinanceApiKeyPermission: FC<
	PropsWithChildren<BinanceApiKeyPermissionProps>
> = ({ children, ok }) => {
	if (ok === undefined) return null
	return (
		<Flex>
			<div>{children}</div>

			<Checkmark ok={ok} />
		</Flex>
	)
}

type BinanceApiKeyPermissionEnableReadingProps = Partial<
	Pick<BinanceApiKeyPermissionCriteria, "enableReading">
>

const BinanceApiKeyPermissionEnableReading: FC<
	BinanceApiKeyPermissionEnableReadingProps
> = ({ enableReading }) => (
	<BinanceApiKeyPermission ok={enableReading}>
		<FormattedMessage
			id="BinanceApiKeyPermissionEnableReading.description"
			values={{
				em: (chunks) => <em>{chunks}</em>
			}}
		/>
	</BinanceApiKeyPermission>
)

type BinanceApiKeyPermissionEnableSpotAndMarginTradingProps = Partial<
	Pick<BinanceApiKeyPermissionCriteria, "enableSpotAndMarginTrading">
>

const BinanceApiKeyPermissionEnableSpotAndMarginTrading: FC<
	BinanceApiKeyPermissionEnableSpotAndMarginTradingProps
> = ({ enableSpotAndMarginTrading }) => (
	<BinanceApiKeyPermission ok={enableSpotAndMarginTrading}>
		<FormattedMessage
			id="BinanceApiKeyPermissionEnableSpotAndMarginTrading.description"
			values={{ em: (chunks) => <em>{chunks}</em> }}
		/>
	</BinanceApiKeyPermission>
)

type BinanceApiKeyPermissionEnableWithdrawalsProps = Partial<
	Pick<BinanceApiKeyPermissionCriteria, "enableWithdrawals">
>

const BinanceApiKeyPermissionEnableWithdrawals: FC<
	BinanceApiKeyPermissionEnableWithdrawalsProps
> = ({ enableWithdrawals }) => (
	<BinanceApiKeyPermission
		ok={
			typeof enableWithdrawals === "boolean"
				? enableWithdrawals === false
				: undefined
		}
	>
		<FormattedMessage
			id="BinanceApiKeyPermissionEnableWithdrawals.description"
			values={{
				b: (chunks) => <b>{chunks}</b>,
				em: (chunks) => <em>{chunks}</em>
			}}
		/>
	</BinanceApiKeyPermission>
)

type BinanceApiKeyPermissionIpRestrictProps = Partial<
	Pick<BinanceApiKeyPermissionCriteria, "ipRestrict">
>

const BinanceApiKeyPermissionIpRestrict: FC<
	BinanceApiKeyPermissionIpRestrictProps
> = ({ ipRestrict }) => (
	<BinanceApiKeyPermission ok={ipRestrict}>
		<FormattedMessage
			id="BinanceApiKeyPermissionIpRestrict.description"
			values={{ em: (chunks) => <em>{chunks}</em> }}
		/>
	</BinanceApiKeyPermission>
)

export type BinanceApiKeyPermissionsProps = {
	permissions: BinanceApiKeyPermissionCriteria | undefined
}

export const BinanceApiKeyPermissions: FC<BinanceApiKeyPermissionsProps> = ({
	permissions
}) => {
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
