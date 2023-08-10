import { Column, Columns } from "@ggbot2/design";
import { FC } from "react";

import { BinanceApi } from "../components/BinanceApi.js";
import { CreateBinanceApi } from "../components/CreateBinanceApi.js";
import { DeleteBinanceApi } from "../components/DeleteBinanceApi.js";

export const BinanceSettings: FC = () => (
  <>
    <Columns isMultiline>
      <Column size="half">
        <BinanceApi />
      </Column>

      <Column size="half">
        <CreateBinanceApi />
      </Column>
    </Columns>

    <DeleteBinanceApi />
  </>
);
