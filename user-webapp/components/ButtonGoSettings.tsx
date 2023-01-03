import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, useCallback, useState } from "react";
import { SettingsSectionId, route } from "_routing";

type Props = {
  section: SettingsSectionId;
};

export const ButtonGoSettings: FC<Props> = ({ section }) => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const goToSettings = useCallback(() => {
    setIsPending(true);
    router.push(route.settingsPage(section));
  }, [router, section, setIsPending]);

  return (
    <Button isSpinning={isPending} onClick={goToSettings}>
      Go to Settings
    </Button>
  );
};
