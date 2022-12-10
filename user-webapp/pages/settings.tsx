import type { NextPage } from "next";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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
  isSettingsSectionId,
} from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const sectionIdStorageKey = "settingsSectionId";
  const [selectedSectionId, setSelectedSectionId] =
    useState<SettingsMenuProps["selected"]>();

  const storeAndSetSelectedSectionId = useCallback<
    SettingsMenuProps["setSelected"]
  >(
    (sectionId) => {
      sessionStorage.setItem(sectionIdStorageKey, sectionId);
      setSelectedSectionId(sectionId);
    },
    [setSelectedSectionId]
  );

  const titleOfSection = useMemo<SettingsMenuProps["titleOfSection"]>(
    () => ({
      account: "Account",
      binance: "Binance",
      billing: "Billing",
    }),
    []
  );

  const sectionTitle = useMemo(
    () => (selectedSectionId ? titleOfSection[selectedSectionId] : ""),
    [titleOfSection, selectedSectionId]
  );

  const sectionContent = useMemo<ReactNode>(() => {
    const componentOfSection: Record<SettingsSectionId, ReactNode> = {
      account: <AccountSettings />,
      binance: <BinanceSettings />,
      billing: <BillingSettings />,
    };
    return selectedSectionId ? componentOfSection[selectedSectionId] : null;
  }, [selectedSectionId]);

  useEffect(() => {
    const storedSelectedSectionId = sessionStorage.getItem(sectionIdStorageKey);

    if (isSettingsSectionId(storedSelectedSectionId)) {
      storeAndSetSelectedSectionId(storedSelectedSectionId);
    } else {
      storeAndSetSelectedSectionId("account");
    }
  }, [storeAndSetSelectedSectionId]);

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
            setSelected={storeAndSetSelectedSectionId}
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
