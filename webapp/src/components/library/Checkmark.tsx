import { classnames } from '_/classnames'

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
					{ 'has-text-success': ok, 'has-text-danger': !ok },
					'mx-2'
				)}
			>
				{ok ? '✓' : '✗'}
			</span>
		</div>
	)
}
