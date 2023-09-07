import { classNames } from "_/classNames"
import { FC } from "react"

export type CheckmarkProps = {
	label?: string
	ok: boolean | undefined
}

export const Checkmark: FC<CheckmarkProps> = ({ label, ok }) =>
	ok === undefined ? null : (
		<div>
			<span>{label}</span>

			<span
				className={classNames(
					{ "has-text-success": ok, "has-text-danger": !ok },
					"mx-2"
				)}
			>
				{
					/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */
					ok ? "✓" : "✗"
				}
			</span>
		</div>
	)
