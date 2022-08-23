import { useRouter } from "next/router";
import { FC, useCallback } from "react";
import { Logo } from "@ggbot2/ui-components";
import { route } from "_routing";

export const Navigation: FC = () => {
  const router = useRouter();

  const onClickBrand = useCallback(() => {
    router.push(route.homePage());
  }, [router]);

  return (
    <header className="fixed top-0 w-full select-none bg-black text-white">
      <div
        className="flex w-fit cursor-pointer flex-row items-center gap-1 px-1"
        onClick={onClickBrand}
      >
        <Logo size={24} />
        <span className="leading-7">
          ggbot<b className="text-primary-brand">2</b>
        </span>
      </div>
    </header>
  );
};
