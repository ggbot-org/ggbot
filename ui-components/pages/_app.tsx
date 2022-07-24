import type { AppProps } from "next/app";
import "../src/tailwind.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
