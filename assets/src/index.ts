import { assetsDomain } from "@ggbot2/aws";

export const assetsBaseUrl = `https://${assetsDomain}`;
const logoBaseUrl = `${assetsBaseUrl}/logo`;

export const favicon = `${logoBaseUrl}/favicon.ico`;
export const faviconSvg = `${logoBaseUrl}/favicon.svg`;
export const logoPng180 = `${logoBaseUrl}/logo-180.png`;
export const logoPng192 = `${logoBaseUrl}/logo-192.png`;