import { Session, isSession, readSessionCookie } from "@ggbot2/cookies";
import { addDays } from "@ggbot2/time";
import type { NextApiRequest } from "next";
import { route } from "./pathnames";

const sessionNumDays = 30;

export const readSession = (
  cookies: NextApiRequest["cookies"]
): Session | undefined => {
  const session = readSessionCookie(cookies);
  if (!isSession(session)) return;
  const { creationDay } = session;
  const sessionIsNotExpired =
    new Date(creationDay) > addDays(-sessionNumDays, new Date());
  if (sessionIsNotExpired) return session;
};

export const redirectToAuthenticationPage = () => ({
  redirect: {
    destination: route.authPage(),
    permanent: false,
  },
});
