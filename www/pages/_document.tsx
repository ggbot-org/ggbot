import { assetsBaseUrl, favicon, faviconSvg, logoPng180 } from "@ggbot2/assets";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href={assetsBaseUrl} />

        <link rel="icon" href={favicon} sizes="any" />

        <link rel="icon" href={faviconSvg} type="image/svg+xml" />

        <link rel="apple-touch-icon" href={logoPng180} />

        <link rel="preconnect" href="https://rsms.me" crossOrigin="" />

        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
      </Head>

      <body>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
