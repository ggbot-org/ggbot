import type { FC } from "react";
import { ButtonGoSettings } from "_components";

export const PleaseConfigureBinanceApi: FC = () => {
  return (
    <div className="bg-yellow-100 p-4">
      <div className="max-w-xl flex flex-col gap-4 text-neutral-800">
        <p className="text-base">You cannot run strategies on Binance yet.</p>
        <p className="text-xl">
          Please go to <em>settings page</em> and configure your Binance API.
        </p>
        <menu>
          <li>
            <ButtonGoSettings />
          </li>
        </menu>
      </div>
    </div>
  );
};
