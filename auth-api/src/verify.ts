import {
  ApiAuthVerifyResponseData,
  isApiAuthVerifyRequestData,
} from "@ggbot2/api";
import {
  ALLOWED_METHODS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
  responseBody,
} from "@ggbot2/api-gateway";
import { createSessionCookie } from "@ggbot2/cookies";
import {
  createAccount,
  deleteOneTimePassword,
  readEmailAccount,
  readOneTimePassword,
} from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import { __200__OK__ } from "@ggbot2/http";
import { UserWebappBaseURL } from "@ggbot2/locators";
import { today } from "@ggbot2/time";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { DEPLOY_STAGE, deployStageIsNotLocal } = ENV;

    const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);

    const accessControlAllowOrigin = {
      "Access-Control-Allow-Origin": userWebappBaseURL.origin,
    };

    switch (event.httpMethod) {
      case "OPTIONS":
        return ALLOWED_METHODS(["POST"]);

      case "POST": {
        if (!event.body) return BAD_REQUEST();

        const input = JSON.parse(event.body);

        if (isApiAuthVerifyRequestData(input)) {
          const { code, email } = input;

          const storedOneTimePassword = await readOneTimePassword(email);

          if (!storedOneTimePassword) {
            return OK(null);
          }

          const verified = code === storedOneTimePassword?.code;

          const output: ApiAuthVerifyResponseData = {
            verified,
          };

          if (!verified) return OK(output);

          await deleteOneTimePassword(email);

          const emailAccount = await readEmailAccount(email);

          const creationDay = today();

          let cookie = "";
          const secure = deployStageIsNotLocal;

          if (emailAccount) {
            const session = { creationDay, accountId: emailAccount.accountId };
            cookie = createSessionCookie(session, { secure });
          } else {
            const account = await createAccount({ email });
            const session = { creationDay, accountId: account.id };
            cookie = createSessionCookie(session, { secure });
          }

          return {
            ...responseBody({ data: output }),
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": cookie,
              ...accessControlAllowOrigin,
            },
            isBase64Encoded: false,
            statusCode: __200__OK__,
          };
        }

        return BAD_REQUEST();
      }

      default:
        return METHOD_NOT_ALLOWED;
    }
  } catch (error) {
    console.error(error);
  }
  return INTERNAL_SERVER_ERROR;
};
