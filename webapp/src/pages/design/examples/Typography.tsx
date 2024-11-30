import { Classname } from '_/classnames'

export function Typography() {
	return (
		<div>
			<div className={'is-size-1' satisfies Classname}>size 1</div>
			<div className={'is-size-2' satisfies Classname}>size 2</div>
			<div className={'is-size-3' satisfies Classname}>size 3</div>
			<div className={'is-size-4' satisfies Classname}>size 4</div>
			<div className={'is-size-5' satisfies Classname}>size 5</div>
			<div className={'is-size-6' satisfies Classname}>size 6</div>
			<div className={'is-size-7' satisfies Classname}>size 7</div>
		</div>
	)
}
