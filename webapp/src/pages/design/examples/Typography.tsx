import { classnames } from "_/classnames"

export function Typography() {
	return (
		<div>
			<div className={classnames("is-size-1")}>size 1</div>

			<div className={classnames("is-size-2")}>size 2</div>

			<div className={classnames("is-size-3")}>size 3</div>

			<div className={classnames("is-size-4")}>size 4</div>

			<div className={classnames("is-size-5")}>size 5</div>

			<div className={classnames("is-size-6")}>size 6</div>

			<div className={classnames("is-size-7")}>size 7</div>
		</div>
	)
}
