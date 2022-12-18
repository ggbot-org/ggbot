import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, useCallback, useState } from "react";
import { route } from "_routing";

export const ButtonGoSettings: FC = () => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const goToSettings = useCallback(() => {
    setIsPending(true);
    router.push(route.settingsPage());
  }, [router, setIsPending]);

  return (
    <Button isSpinning={isPending} onClick={goToSettings}>
      Go to Settings
    </Button>
  );
};
