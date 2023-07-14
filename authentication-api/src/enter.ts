import {
  ApiAuthEnterResponseData,
  isApiAuthEnterRequestData,
} from "@ggbot2/api";
import {
  ALLOWED_METHODS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
} from "@ggbot2/api-gateway";
import { createOneTimePassword, sendOneTimePassword } from "@ggbot2/database";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    switch (event.httpMethod) {
      case "OPTIONS":
        return ALLOWED_METHODS(["POST"]);

      case "POST": {
        if (!event.body) return BAD_REQUEST();

        const input = JSON.parse(event.body);

        if (isApiAuthEnterRequestData(input)) {
          const { email } = input;

          const oneTimePassword = await createOneTimePassword(email);
          await sendOneTimePassword({ email, oneTimePassword });

          const output: ApiAuthEnterResponseData = {
            emailSent: true,
          };

          return OK(output);
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
