import { Box, Title } from "@ggbot2/design";
import { FC, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { AccountId } from "../components/AccountId.js";
import { Email } from "../components/Email.js";
import { WhenCreated } from "../components/WhenCreated.js";
import { AuthenticationContext } from "../contexts/Authentication.js";

export const AccountSettings: FC = () => {
  const { account } = useContext(AuthenticationContext);

  return (
    <Box>
      <Title>
        <FormattedMessage id="AccountSettings.title" />
      </Title>

      <Email readOnly value={account.email} />

      <WhenCreated value={account.whenCreated} />

      <AccountId value={account.id} />
    </Box>
  );
};
