import { classNames } from "_/classNames"
import { FC, PropsWithChildren } from "react"

export const H1: FC<PropsWithChildren> = ({ children }) => (
	<h1 className={classNames("is-size-1")}>{children}</h1>
)

export const H2: FC<PropsWithChildren> = ({ children }) => (
	<h2 className={classNames("is-size-1")}>{children}</h2>
)
