import { Button } from "@ggbot2/design";
import { FC, useState } from "react";

import { buttonLabel } from "../i18n/index.js";
import { pathname } from "../routing/pathnames.js";
import { SettingsPageId } from "../routing/types.js";

type Props = {
  settingsPage: SettingsPageId;
};

export const GoSettingsButton: FC<Props> = ({ settingsPage }) => {
  const [isPending, setIsPending] = useState(false);

  const onClick = () => {
    setIsPending(true);
    window.location.pathname = pathname.settingsPage(settingsPage);
  };

  return (
    <Button isLoading={isPending} onClick={onClick}>
      {buttonLabel.goToSettings}
    </Button>
  );
};
