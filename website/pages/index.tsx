import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Page: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ggbot2</title>
        <meta name="description" content="crypto flow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <h1 className={styles.brandName}>ggbot2</h1>
            <p>
              <i>crypto flow</i>
            </p>
          </div>

          <div className={styles.cta}>Launch App</div>
        </section>
      </main>

      <footer className={styles.footer}>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </footer>
    </div>
  );
};

export default Page;
