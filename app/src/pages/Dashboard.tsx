import { CreateStrategy } from "_components/CreateStrategy";
import { Strategies } from "_components/Strategies";
import { OneSectionLayout } from "_layouts/OneSection";
import { FC } from "react";

export const DashboardPage: FC = () => (
  <OneSectionLayout>
    <CreateStrategy />

    <Strategies />
  </OneSectionLayout>
);
