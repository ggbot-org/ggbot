import { FC } from "react"

import { classNames } from "../../../styles/classNames.js"

export const Typography: FC = () => (
	<div>
		<div className={classNames("is-size-1")}>size 1</div>

		<div className={classNames("is-size-2")}>size 2</div>

		<div className={classNames("is-size-3")}>size 3</div>

		<div className={classNames("is-size-4")}>size 4</div>

		<div className={classNames("is-size-5")}>size 5</div>

		<div className={classNames("is-size-6")}>size 6</div>

		<div className={classNames("is-size-7")}>size 7</div>
	</div>
)
