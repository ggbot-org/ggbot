import { Header, Logo } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page: NextPage = () => {
  const [isFirstPageview, setIsFirstPageview] = useState(false);

  useEffect(() => {
    const storageKey = "first-page-view";
    const firstPageView = global?.window?.sessionStorage?.getItem(storageKey);
    if (typeof firstPageView === "string") return;
    global?.window?.sessionStorage?.setItem(storageKey, new Date().toJSON());
    setIsFirstPageview(true);
  }, [setIsFirstPageview]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>ggbot2</title>
        <meta name="description" content="crypto flow" />
      </Head>

      <Header>
        <div className="m-6 max-h-96 flex flex-col items-center lg:flex-row gap-6">
          <Logo animated={isFirstPageview} size={400} />
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-8xl">
              ggbot<b className="text-primary-brand">2</b>
            </h1>
            <i>crypto flow</i>
          </div>
        </div>
      </Header>

      <main className="grow inline-flex items-center justify-center">
        <Link href="https://next.ggbot2.com">
          <a className="font-medium text-2xl cursor-pointer bg-black text-white px-6 py-8 rounded-md active:bg-primary-brand active:text-primary-900 hover:ring-4 outline-0 focus:ring-4 ring-primary-brand transition-colors ease-in">
            Launch App
          </a>
        </Link>
      </main>

      <footer className="py-2 inline-flex justify-center gap-4">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </footer>
    </div>
  );
};

export default Page;
