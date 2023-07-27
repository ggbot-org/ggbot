import { FC, PropsWithChildren } from "react";

import { OneSection } from "../components/OneSection.js";
import { PageLayout } from "../layouts/Page.js";

export const OneSectionLayout: FC<PropsWithChildren> = ({ children }) => (
  <PageLayout>
    <OneSection>{children}</OneSection>
  </PageLayout>
);
