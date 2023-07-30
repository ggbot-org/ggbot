import { BinanceApiKeyPermission } from "@ggbot2/binance";
import { Checkmark } from "@ggbot2/design";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

type BinanceApiKeyPermissionEnableReadingProps = Partial<
  Pick<BinanceApiKeyPermission, "enableReading">
>;

export const BinanceApiKeyPermissionEnableReading: FC<
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
  Pick<BinanceApiKeyPermission, "enableSpotAndMarginTrading">
>;

export const BinanceApiKeyPermissionEnableSpotAndMarginTrading: FC<
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
  Pick<BinanceApiKeyPermission, "enableWithdrawals">
>;

export const BinanceApiKeyPermissionEnableWithdrawals: FC<
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
  Pick<BinanceApiKeyPermission, "ipRestrict">
>;
export const BinanceApiKeyPermissionIpRestrict: FC<
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
