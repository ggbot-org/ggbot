import { Navigation } from "_components/Navigation";
import { NextPage } from "next";
import Head from "next/head";

import styles from "../styles/PrivacyAndTerms.module.css";

const Page: NextPage = () => (
  <>
    <Head>
      <title>ggbot2</title>
    </Head>

    <Navigation />

    <main className={styles.main}>
      <h1>Privacy Policy</h1>

      <p>
        Welcome to <em>ggbot2</em>. Please read this Privacy Policy carefully as
        you agree to be bound by it while using the <em>ggbot2</em> website.
      </p>

      <h2>Personal Data</h2>

      <p>Your personal data is not shared with third parties.</p>

      <p>No personal data is collected other than your account email.</p>

      <p>Your email is used for authentication and communications.</p>

      <p>
        We store all Personal Data on secure servers administered by Amazon,
        located in the United States of America.
      </p>

      <p>
        No third party service is used for email communications, we are using
        Amazon&apos;s Simple Email Service.
      </p>
    </main>
  </>
);

export default Page;
