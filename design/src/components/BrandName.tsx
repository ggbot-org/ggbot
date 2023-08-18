import { FC } from "react"
import { SizeModifierProp } from "trunx"

import { classNames } from "../components/classNames.js"

export type BrandNameProps = SizeModifierProp<"medium" | "normal">

export const BrandName: FC<BrandNameProps> = ({ size = "normal" }) => (
	<span
		className={classNames("has-text-weight-medium", {
			"is-size-3": size === "medium",
			"is-size-5": size === "normal",
			"mb-1": size === "normal"
		})}
	>
		ggbot
	</span>
)
