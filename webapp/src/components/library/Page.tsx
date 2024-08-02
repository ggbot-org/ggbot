import { classnames } from "_/classnames"
import { PropsWithChildren, ReactNode } from "react"

type Props = {
	footer?: ReactNode
}

export function Page({ children, footer }: PropsWithChildren<Props>) {
	return (
		<div className={classnames("page")}>
			<div className={classnames("page__content")}>{children}</div>

			{footer ? (
				<div className={classnames("page__footer")}>{footer}</div>
			) : null}
		</div>
	)
}
