import { Container, Section } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";

import { PageLayout } from "./Page";

export const OneSectionLayout: FC<PropsWithChildren> = ({ children }) => (
  <PageLayout>
    <Section>
      <Container maxWidth="desktop">{children}</Container>
    </Section>
  </PageLayout>
);
