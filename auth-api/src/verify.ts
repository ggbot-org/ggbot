import {
  ApiAuthVerifyResponseData,
  isApiAuthVerifyRequestData,
} from "@ggbot2/api";
import { createSessionCookie } from "@ggbot2/cookies";
import {
  createAccount,
  deleteOneTimePassword,
  readEmailAccount,
  readOneTimePassword,
} from "@ggbot2/database";
import { ENV } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
} from "@ggbot2/http-status-codes";
import { UserWebappBaseURL } from "@ggbot2/locators";
import { today } from "@ggbot2/time";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const { DEPLOY_STAGE } = ENV;

const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE);

const accessControlAllowOrigin = {
  "Access-Control-Allow-Origin": userWebappBaseURL.origin,
};

const BAD_REQUEST: APIGatewayProxyResult = {
  body: "",
  headers: accessControlAllowOrigin,
  isBase64Encoded: false,
  statusCode: __400__BAD_REQUEST__,
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  switch (event.httpMethod) {
    case "OPTIONS": {
      return {
        body: "",
        headers: {
          "Access-Control-Allow-Headers": "Content-type",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          ...accessControlAllowOrigin,
        },
        isBase64Encoded: false,
        statusCode: __200__OK__,
      };
    }

    case "POST": {
      if (!event.body) return BAD_REQUEST;

      const input = JSON.parse(event.body);

      if (isApiAuthVerifyRequestData(input)) {
        const { code, email } = input;

        const storedOneTimePassword = await readOneTimePassword(email);

        const verified = code === storedOneTimePassword?.code;

        const responseData: ApiAuthVerifyResponseData = {
          verified,
        };

        if (!verified)
          return {
            body: JSON.stringify(responseData),
            headers: {
              "Content-Type": "application/json",
              ...accessControlAllowOrigin,
            },
            isBase64Encoded: false,
            statusCode: __200__OK__,
          };

        await deleteOneTimePassword(email);

        const emailAccount = await readEmailAccount(email);

        const creationDay = today();

        let cookie = "";

        if (emailAccount) {
          const session = { creationDay, accountId: emailAccount.accountId };
          cookie = createSessionCookie(session, {
            secure: DEPLOY_STAGE !== "local",
          });
        } else {
          const account = await createAccount({ email });
          const session = { creationDay, accountId: account.id };
          cookie = createSessionCookie(session, {
            secure: DEPLOY_STAGE !== "local",
          });
        }

        return {
          body: JSON.stringify(responseData),
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": cookie,
            ...accessControlAllowOrigin,
          },
          isBase64Encoded: false,
          statusCode: __200__OK__,
        };
      }

      return BAD_REQUEST;
    }

    default: {
      return {
        body: "",
        headers: accessControlAllowOrigin,
        isBase64Encoded: false,
        statusCode: __405__METHOD_NOT_ALLOWED__,
      };
    }
  }
};
