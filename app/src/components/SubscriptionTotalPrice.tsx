import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "color" | "help" | "label" | "readOnly"> & {
  isYearlyPurchase: boolean;
};

export const SubscriptionTotalPrice: FC<Props> = ({
  value,
  isYearlyPurchase,
}) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      readOnly
      label={formatMessage({ id: "SubscriptionTotalPrice.label" })}
      color={isYearlyPurchase ? "success" : undefined}
      value={value}
      help={
        isYearlyPurchase
          ? formatMessage({ id: "SubscriptionTotalPrice.discount" })
          : undefined
      }
    />
  );
};
