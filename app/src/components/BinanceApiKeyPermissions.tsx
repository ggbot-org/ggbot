import { Checkmark } from "@ggbot2/design";
import { BinanceApiKeyPermissionCriteria } from "@ggbot2/models";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

type BinanceApiKeyPermissionEnableReadingProps = Partial<
  Pick<BinanceApiKeyPermissionCriteria, "enableReading">
>;

const BinanceApiKeyPermissionEnableReading: FC<
  BinanceApiKeyPermissionEnableReadingProps
> = ({ enableReading }) => {
  if (enableReading === undefined) return null;

  return (
    <span>
      <FormattedMessage
        id="BinanceApiKeyPermissionEnableReading.description"
        values={{
          em: (chunks) => <em>{chunks}</em>,
        }}
      />

      <Checkmark ok={enableReading} />
    </span>
  );
};

type BinanceApiKeyPermissionEnableSpotAndMarginTradingProps = Partial<
  Pick<BinanceApiKeyPermissionCriteria, "enableSpotAndMarginTrading">
>;

const BinanceApiKeyPermissionEnableSpotAndMarginTrading: FC<
  BinanceApiKeyPermissionEnableSpotAndMarginTradingProps
> = ({ enableSpotAndMarginTrading }) => (
  <span>
    <FormattedMessage
      id="BinanceApiKeyPermissionEnableSpotAndMarginTrading.description"
      values={{ em: (chunks) => <em>{chunks}</em> }}
    />

    <Checkmark ok={enableSpotAndMarginTrading} />
  </span>
);

type BinanceApiKeyPermissionEnableWithdrawalsProps = Partial<
  Pick<BinanceApiKeyPermissionCriteria, "enableWithdrawals">
>;

const BinanceApiKeyPermissionEnableWithdrawals: FC<
  BinanceApiKeyPermissionEnableWithdrawalsProps
> = ({ enableWithdrawals }) => (
  <span>
    <FormattedMessage
      id="BinanceApiKeyPermissionEnableWithdrawals.description"
      values={{ em: (chunks) => <em>{chunks}</em> }}
    />

    <Checkmark
      ok={
        typeof enableWithdrawals === "boolean"
          ? enableWithdrawals === false
          : undefined
      }
    />
  </span>
);

type BinanceApiKeyPermissionIpRestrictProps = Partial<
  Pick<BinanceApiKeyPermissionCriteria, "ipRestrict">
>;

const BinanceApiKeyPermissionIpRestrict: FC<
  BinanceApiKeyPermissionIpRestrictProps
> = ({ ipRestrict }) => {
  if (ipRestrict === undefined) return null;

  return (
    <span>
      <FormattedMessage
        id="BinanceApiKeyPermissionIpRestrict.description"
        values={{ em: (chunks) => <em>{chunks}</em> }}
      />

      <Checkmark ok={ipRestrict} />
    </span>
  );
};

type BinanceApiKeyPermissionsProps = {
  permissions: BinanceApiKeyPermissionCriteria | undefined;
};

export const BinanceApiKeyPermissions: FC<BinanceApiKeyPermissionsProps> = ({
  permissions,
}) => {
  if (!permissions) return null;

  const {
    enableReading,
    enableWithdrawals,
    enableSpotAndMarginTrading,
    ipRestrict,
  } = permissions;

  return (
    <div>
      <BinanceApiKeyPermissionEnableReading enableReading={enableReading} />

      <BinanceApiKeyPermissionEnableWithdrawals
        enableWithdrawals={enableWithdrawals}
      />

      <BinanceApiKeyPermissionEnableSpotAndMarginTrading
        enableSpotAndMarginTrading={enableSpotAndMarginTrading}
      />

      <BinanceApiKeyPermissionIpRestrict ipRestrict={ipRestrict} />
    </div>
  );
};
