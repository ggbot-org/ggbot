import { Logo } from "@ggbot2/design";
import { UserWebappHomepageURL } from "@ggbot2/locators";
import { createdNow } from "@ggbot2/models";
import { mount } from "@ggbot2/react";
import { FC, useEffect, useState } from "react";

import { pathname } from "../routing/pathnames.js";

const userWebappHomepageURL = new UserWebappHomepageURL("main");

const Page: FC = () => {
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
      <div>
        <Logo animated={isFirstPageview} size={400} />

        <div>
          <h1>
            ggbot<b>2</b>
          </h1>

          <i>crypto flow</i>
        </div>
      </div>

      <main>
        <a href={userWebappHomepageURL.toString()}>
          <span>Launch App</span>
        </a>
      </main>

      <footer>
        <a href={pathname.privacyPolicyPage()}>Privacy Policy</a>
        <a href={pathname.termsOfServicePage()}>Terms of Service</a>
      </footer>
    </div>
  );
};

mount(Page);
