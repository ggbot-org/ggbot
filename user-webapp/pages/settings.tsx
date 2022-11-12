import type { NextPage } from "next";
import { ReactNode, useMemo, useState } from "react";
import {
  AccountSettings,
  BillingSettings,
  BinanceSettings,
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationLabel,
  SettingsMenu,
  SettingsMenuProps,
  SettingsSectionId,
} from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const [selectedSectionId, setSelectedSectionId] =
    useState<SettingsSectionId>("account");

  const titleOfSection = useMemo<SettingsMenuProps["titleOfSection"]>(
    () => ({
      account: "Account",
      binance: "Binance",
      billing: "Billing",
    }),
    []
  );

  const sectionTitle = useMemo(
    () => titleOfSection[selectedSectionId],
    [titleOfSection, selectedSectionId]
  );

  const sectionContent = useMemo<ReactNode>(() => {
    const componentOfSection: Record<SettingsSectionId, ReactNode> = {
      account: <AccountSettings />,
      binance: <BinanceSettings />,
      billing: <BillingSettings />,
    };
    return componentOfSection[selectedSectionId];
  }, [selectedSectionId]);

  return (
    <Content
      topbar={
        <Navigation
          breadcrumbs={[
            {
              content: <NavigationBreadcrumbDashboard isLink />,
            },
            {
              content: <NavigationLabel text="settings" />,
              current: true,
            },
          ]}
        />
      }
    >
      <div className="flex flex-col md:flex-row gap-4 wrap">
        <div className="my-2 md:my-6">
          <SettingsMenu
            titleOfSection={titleOfSection}
            selected={selectedSectionId}
            setSelected={setSelectedSectionId}
          />
        </div>
        <div className="my-2 md:my-4 flex flex-col gap-2 grow">
          <div className="m-2">
            <h2 className="text-xl">{sectionTitle}</h2>
          </div>
          <div className="flex flex-col m-2">{sectionContent}</div>
        </div>
      </div>
    </Content>
  );
};

export default Page;
