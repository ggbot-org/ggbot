import { FC } from "react";
import { useIntl } from "react-intl";

import { Name, NameProps } from "../components/Name.js";

export type AccountNickNameProps = Omit<NameProps, "label">;

export const AccountNickName: FC<AccountNickNameProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <Name label={formatMessage({ id: "AccountNickName.label" })} {...props} />
  );
};
