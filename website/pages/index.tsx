import { Header, Logo } from "@ggbot2/design";
import { createdNow } from "@ggbot2/models";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page: NextPage = () => {
  const [isFirstPageview, setIsFirstPageview] = useState(false);

  useEffect(() => {
    const storageKey = "first-page-view";
    const firstPageView = sessionStorage.getItem(storageKey);
    if (firstPageView) return;
    sessionStorage.setItem(storageKey, JSON.stringify(createdNow()));
    setIsFirstPageview(true);
  }, [setIsFirstPageview]);

  return (
    <div>
      <Head>
        <title>ggbot2</title>
        <meta name="description" content="crypto flow" />
      </Head>

      <Header>
        <div>
          <Logo animated={isFirstPageview} size={400} />
          <div>
            <h1>
              ggbot<b>2</b>
            </h1>
            <i>crypto flow</i>
          </div>
        </div>
      </Header>

      <main>
        <Link href="https://app.ggbot2.com">
          <span>Launch App</span>
        </Link>
      </main>

      <footer>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
        <Link href="/roadmap">Roadmap</Link>
      </footer>
    </div>
  );
};

export default Page;
