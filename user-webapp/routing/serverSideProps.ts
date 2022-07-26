import type { GetServerSideProps } from "next";
import { readSession, redirectToAuthenticationPage } from "./authentication";

export type HasSession = {
  hasSession: boolean;
};

export const requireAuthentication: GetServerSideProps = async ({ req }) =>
  readSession(req.cookies) ? { props: {} } : redirectToAuthenticationPage();
