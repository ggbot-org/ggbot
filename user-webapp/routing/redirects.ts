import { route } from "./pathnames";

export const redirectToAuthenticationPage = () => ({
  redirect: {
    destination: route.authPage(),
    permanent: false,
  },
});

export const redirectToHomePage = () => ({
  redirect: {
    destination: route.homePage(),
    permanent: false,
  },
});
