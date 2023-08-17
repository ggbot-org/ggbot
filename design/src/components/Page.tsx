import { FC, PropsWithChildren, ReactNode } from "react"

import { classNames } from "../components/classNames.js"

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
