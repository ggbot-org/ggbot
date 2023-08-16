import { FC } from "react"

import { _classNames } from "../components/_classNames.js"

export type CheckmarkProps = {
	label?: string
	ok: boolean | undefined
}

export const Checkmark: FC<CheckmarkProps> = ({ label, ok }) =>
	ok === undefined ? null : (
		<div>
			<span>{label}</span>

			<span
				className={_classNames(
					{ "has-text-success": ok, "has-text-danger": !ok },
					"mx-2"
				)}
			>
				{ok ? "✓" : "✗"}
			</span>
		</div>
	)
