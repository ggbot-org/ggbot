import { assetsDomain } from "@ggbot2/aws";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href={`https://{assetsDomain}`} />

        <link
          rel="icon"
          href={`https://${assetsDomain}/logo/favicon.ico`}
          sizes="any"
        />
        <link
          rel="icon"
          href={`https://${assetsDomain}/logo/favicon.svg`}
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href={`https://${assetsDomain}/logo/logo-180.png`}
        />

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
