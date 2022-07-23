import { route } from "./pathnames";

export const redirectToAuthenticationPage = () => ({
  redirect: {
    destination: route.authPage(),
    permanent: false,
  },
});
