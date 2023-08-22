import { FC } from "react"
import { SizeModifierProp } from "trunx"

import { classNames } from "../components/classNames.js"

export type BrandNameProps = SizeModifierProp<"medium" | "normal" | "large">

export const BrandName: FC<BrandNameProps> = ({ size = "normal" }) => (
	<span
		className={classNames({
			"is-size-1": size === "large",
			"has-text-weight-semibold": size === "large",
			"has-text-weight-medium": size === "medium" || size === "normal",
			"is-size-3": size === "medium",
			"is-size-5": size === "normal",
			"mb-1": size === "normal"
		})}
	>
		ggbot
	</span>
)
