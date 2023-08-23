import { classNames } from "_/classNames"
import { FC, PropsWithChildren, ReactNode } from "react"

export type PageProps = {
	footer?: ReactNode
}

export const Page: FC<PropsWithChildren<PageProps>> = ({
	children,
	footer
}) => (
	<div className={classNames("Page")}>
		<div className={classNames("Page_content")}>{children}</div>

		{footer ? (
			<div className={classNames("Page_footer")}>{footer}</div>
		) : null}
	</div>
)
