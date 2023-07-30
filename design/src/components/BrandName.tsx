import { FC } from "react";
import { SizeModifierProp } from "trunx";

import { _classNames } from "../components/_classNames.js";

export type BrandNameProps = SizeModifierProp<"medium" | "normal">;

export const BrandName: FC<BrandNameProps> = ({ size = "normal" }) => (
  <span
    className={_classNames("has-text-weight-medium", {
      "is-size-3": size === "medium",
      "is-size-5": size === "normal",
    })}
  >
    ggbot<b className={_classNames("has-text-primary")}>2</b>
  </span>
);
