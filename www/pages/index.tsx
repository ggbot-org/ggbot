import { Header, Logo } from "@ggbot2/design";
import { pathname, UserWebappHomepageURL } from "@ggbot2/locators";
import { createdNow } from "@ggbot2/models";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const userWebappHomepageURL = new UserWebappHomepageURL();

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
        <Link href={userWebappHomepageURL}>
          <span>Launch App</span>
        </Link>
      </main>

      <footer>
        <Link href={pathname.privacyPolicyPage()}>Privacy Policy</Link>

        <Link href={pathname.termsOfServicePage()}>Terms of Service</Link>
      </footer>
    </div>
  );
};

export default Page;
