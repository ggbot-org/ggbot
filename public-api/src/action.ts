import { isPublicApiActionRequestData as isApiActionRequestData } from "@ggbot2/api";
import {
  ALLOWED_METHODS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  OK,
} from "@ggbot2/api-gateway";
import { readStrategy, readStrategyFlow } from "@ggbot2/database";
import { isReadStrategyFlowInput, isReadStrategyInput } from "@ggbot2/models";
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

        const action = JSON.parse(event.body);

        if (!isApiActionRequestData(action)) return BAD_REQUEST();
        const actionData = action.data;

        switch (action.type) {
          case "ReadStrategy": {
            if (!isReadStrategyInput(actionData)) return BAD_REQUEST();
            const output = await readStrategy(actionData);
            return OK(output);
          }

          case "ReadStrategyFlow": {
            if (!isReadStrategyFlowInput(actionData)) return BAD_REQUEST();
            const output = await readStrategyFlow(actionData);
            return OK(output);
          }

          default:
            return BAD_REQUEST();
        }
      }
      default:
        METHOD_NOT_ALLOWED;
    }
  } catch (error) {
    console.error(error);
  }
  return INTERNAL_SERVER_ERROR;
};
