import { assetsBaseUrl, favicon, faviconSvg, logoPng180 } from "@ggbot2/assets";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href={assetsBaseUrl} />

        <link rel="icon" href={favicon} sizes="any" />
        <link rel="icon" href={faviconSvg} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={logoPng180} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
