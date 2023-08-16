import { ENV } from "@ggbot2/env";

export const isDev = ENV.DEPLOY_STAGE() !== "main";
