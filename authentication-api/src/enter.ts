import {
  ApiAuthEnterResponseData,
  isApiAuthEnterRequestData,
} from "@ggbot2/api";
import {
  ALLOWED_METHODS,
  APIGatewayProxyHandler,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
} from "@ggbot2/api-gateway";
import { createOneTimePassword, sendOneTimePassword } from "@ggbot2/database";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    switch (event.httpMethod) {
      case "OPTIONS":
        return ALLOWED_METHODS(["POST"]);

      case "POST": {
        if (!event.body) return BAD_REQUEST();

        const input = JSON.parse(event.body);

        if (isApiAuthEnterRequestData(input)) {
          const { email } = input;

          // TODO read language from enter request
          // which reads it from detectLocale
          const language = "en";
          const oneTimePassword = await createOneTimePassword(email);
          await sendOneTimePassword({ language, email, oneTimePassword });

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
