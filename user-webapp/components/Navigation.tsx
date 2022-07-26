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
    <header className="fixed top-0 w-full bg-black text-white select-none">
      <div
        className="flex flex-row items-center gap-1 px-1 cursor-pointer w-fit"
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
