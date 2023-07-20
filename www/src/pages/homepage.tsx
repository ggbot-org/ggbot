import { Logo } from "@ggbot2/design";
import { UserWebappHomepageURL } from "@ggbot2/locators";
import { mount } from "@ggbot2/react";
import { sessionWebStorage } from "@ggbot2/web-storage";
import { FC, useEffect } from "react";

import { pathname } from "../routing/pathnames.js";

const userWebappHomepageURL = new UserWebappHomepageURL("main");

const Page: FC = () => {
  const gotFirstPageView = sessionWebStorage.gotFirstPageView;

  useEffect(() => {
    if (!gotFirstPageView) sessionWebStorage.gotFirstPageView = true;
  }, [gotFirstPageView]);

  return (
    <div>
      <div>
        <Logo animated={!gotFirstPageView} size={400} />

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
