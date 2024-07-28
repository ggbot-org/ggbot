import { PropsWithChildren } from "react"
import { Tag as _Tag, TagProps as _TagProps } from "trunx"

export type TagProps = Omit<_TagProps, "bulma" | "isRounded">

export function Tag({ children, ...props }: PropsWithChildren<TagProps>) {
	return (
		<_Tag bulma="is-light" {...props}>
			{children}
		</_Tag>
	)
}
