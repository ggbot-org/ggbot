import { Button } from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { buttonLabel } from "_i18n";
import { pathname } from "_routing/pathnames";
import { SettingsSectionId } from "_routing/types";

type Props = {
  section: SettingsSectionId;
};

export const GoSettingsButton: FC<Props> = ({ section }) => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const onClick = () => {
    setIsPending(true);
    router.push(pathname.settingsPage(section));
  };

  return (
    <Button isLoading={isPending} onClick={onClick}>
      {buttonLabel.goToSettings}
    </Button>
  );
};
