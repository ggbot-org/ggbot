import { AppProps } from "next/app";
import "../src/styles/example.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
