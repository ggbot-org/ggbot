import { SettingsSectionId } from "../routing/types.js";

export const settingsHtmlAppJs = (sectionId: SettingsSectionId) =>
  `${sectionId}-settings.js`;

export const settingsHtmlFilename = (sectionId: SettingsSectionId) =>
  `${sectionId}-settings.html`;
