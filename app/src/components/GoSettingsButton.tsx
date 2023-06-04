import { Button } from "@ggbot2/design";
import { FC, useState } from "react";

import { buttonLabel } from "../i18n/index.js";
import { pathname } from "../routing/pathnames.js";
import { SettingsSectionId } from "../routing/types.js";

type Props = {
  section: SettingsSectionId;
};

export const GoSettingsButton: FC<Props> = ({ section }) => {
  const [isPending, setIsPending] = useState(false);

  const onClick = () => {
    setIsPending(true);
    window.location.pathname = pathname.settingsPage(section);
  };

  return (
    <Button isLoading={isPending} onClick={onClick}>
      {buttonLabel.goToSettings}
    </Button>
  );
};
