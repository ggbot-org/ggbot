import { classnames } from "_/classnames"

export type CheckmarkProps = {
	label?: string
	ok: boolean | undefined
}

export function Checkmark({ label, ok }: CheckmarkProps) {
	return ok === undefined ? null : (
		<div>
			<span>{label}</span>
			<span
				className={classnames(
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
}
