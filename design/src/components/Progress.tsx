import { FC } from "react"
import { Progress as _Progress, ProgressProps as _ProgressProps } from "trunx"

export type ProgressProps = Omit<_ProgressProps, "color" | "size">

export const Progress: FC<ProgressProps> = (props) => (
	<_Progress size="small" {...props} />
)
