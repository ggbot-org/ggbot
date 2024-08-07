import { classnames } from "_/classnames"
import { PropsWithChildren, ReactNode } from "react"

export function Page({ footer, header, children }: PropsWithChildren<{
	header: ReactNode
	footer?: ReactNode
}>) {
	return (
		<div className={classnames("page")}>
			{header}
			<div className={classnames("page__content")}>{children}</div>
			{footer ? (<div className={classnames("page__footer")}>{footer}</div>) : null}
		</div>
	)
}
