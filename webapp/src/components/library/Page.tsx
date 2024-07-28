import { classnames } from "_/classnames"
import { PropsWithChildren, ReactNode } from "react"

type Props = {
	footer?: ReactNode
}

export function Page({ children, footer }: PropsWithChildren<Props>) {
	return (
		<div className={classnames("Page")}>
			<div className={classnames("Page__content")}>{children}</div>

			{footer ? (
				<div className={classnames("Page__footer")}>{footer}</div>
			) : null}
		</div>
	)
}
