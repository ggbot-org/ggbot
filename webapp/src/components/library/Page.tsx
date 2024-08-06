import { classnames } from "_/classnames"
import { PropsWithChildren, ReactNode } from "react"

export function Page({ children, footer }: PropsWithChildren<{ footer?: ReactNode }>) {
	return (
		<div className={classnames("page")}>
			<div className={classnames("page__content")}>{children}</div>
			{footer ? (
				<div className={classnames("page__footer")}>{footer}</div>
			) : null}
		</div>
	)
}
