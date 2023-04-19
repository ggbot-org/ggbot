import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Navigation } from "_components/Navigation";
import styles from "../styles/PrivacyAndTerms.module.css";

const Page: NextPage = () => (
    <div>
      <Head>
        <title>ggbot2</title>
      </Head>

      <Navigation />

      <main className={styles.main}>
        <h1>Terms of Service</h1>
        <p>
          Welcome to <em>ggbot2</em>. Please read this <em>Terms of Service</em>{" "}
          carefully as you agree to be bound by it while using the{" "}
          <em>ggbot2</em> website.
        </p>

        <h2>Website access</h2>
        <p>
          You access <em>ggbot2</em> website with your account email.
        </p>
        <p>Keep your email safe, it is your responsibility.</p>

        <h2>Binance API</h2>
        <p>
          The <em>ggbot2</em> engine needs your grant to access your Binance
          account using Binance API key.
        </p>
        <p>
          It is crucial to understand that <em>ggbot2</em> will use a Binance
          API key only if its <b>withdrawal permission is disabled</b>. This
          means that <em>ggbot2</em> as well as any other human or software that
          will access the Binance API key you provided, will not be able to
          withdraw from your Binance account.
        </p>

        <h2>Product pricing</h2>
        <p>
          All prices shown on the website include the applicable VAT rate.
          Depending on your country of purchase, other local charges and taxes
          may also apply.
        </p>

        <h2>Privacy</h2>
        <p>
          Please review our <Link href="/privacy">Privacy Policy</Link> as it
          governs the privacy practices undertaken by <em>ggbot2</em>.
        </p>
      </main>
    </div>
  );

export default Page;
