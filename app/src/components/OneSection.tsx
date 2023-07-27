import { Container, Section } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";

export const OneSection: FC<PropsWithChildren> = ({ children }) => (
  <Section>
    <Container maxWidth="desktop">{children}</Container>
  </Section>
);
