import { AppProps } from "next/app";
import "../src/tailwind.css";
import "../src/styles/main.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
