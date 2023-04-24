import { pathname } from "./pathnames.js";
import { userWebappBaseUrl } from "./baseURLs.js";

export const userWebappHomepageUrl = new URL(
  pathname.homePage(),
  userWebappBaseUrl
);
