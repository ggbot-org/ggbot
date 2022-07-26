import type { GetServerSideProps } from "next";
import { readSession, redirectToAuthenticationPage } from "./authentication";

export type { StrategyKey } from "@ggbot2/models";

export type HasSession = {
  hasSession: boolean;
};

export const requireAuthentication: GetServerSideProps = async ({ req }) =>
  readSession(req.cookies) ? { props: {} } : redirectToAuthenticationPage();
