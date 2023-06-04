import { FC, PropsWithChildren } from "react";
import { Tag as _Tag, TagProps as _TagProps } from "trunx";

export type TagProps = Omit<_TagProps, "isLight" | "isRounded">;

export const Tag: FC<PropsWithChildren<TagProps>> = ({
  children,
  ...props
}) => (
  <_Tag isLight isRounded {...props}>
    {children}
  </_Tag>
);
