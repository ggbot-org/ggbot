import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="data:;base64,=" />

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
