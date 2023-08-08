//
// Copied from aws-lambda and @types/aws-lambda packages.
//
// Notice there are also
//
// import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
//
// See https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
//
// > If you create a Lambda integration by using the AWS CLI, AWS CloudFormation, or an SDK, you must specify a payloadFormatVersion.
//
// So, the lambda creation should specify payloadFormatVersion = '2.0' and then it would be possible to migrate.

export type APIGatewayEventDefaultAuthorizerContext =
  | undefined
  | null
  | {
      [name: string]: unknown;
    };

export interface APIGatewayEventClientCertificate {
  clientCertPem: string;
  serialNumber: string;
  subjectDN: string;
  issuerDN: string;
  validity: {
    notAfter: string;
    notBefore: string;
  };
}

type APIGatewayEventIdentity = {
  accessKey: string | null;
  accountId: string | null;
  apiKey: string | null;
  apiKeyId: string | null;
  caller: string | null;
  clientCert: APIGatewayEventClientCertificate | null;
  cognitoAuthenticationProvider: string | null;
  cognitoAuthenticationType: string | null;
  cognitoIdentityId: string | null;
  cognitoIdentityPoolId: string | null;
  principalOrgId: string | null;
  sourceIp: string;
  user: string | null;
  userAgent: string | null;
  userArn: string | null;
};

type APIGatewayEventRequestContextWithAuthorizer<TAuthorizerContext> = {
  accountId: string;
  apiId: string;
  // This one is a bit confusing: it is not actually present in authorizer calls
  // and proxy calls without an authorizer. We model this by allowing undefined in the type,
  // since it ends up the same and avoids breaking users that are testing the property.
  // This lets us allow parameterizing the authorizer for proxy events that know what authorizer
  // context values they have.
  authorizer: TAuthorizerContext;
  connectedAt?: number | undefined;
  connectionId?: string | undefined;
  domainName?: string | undefined;
  domainPrefix?: string | undefined;
  eventType?: string | undefined;
  extendedRequestId?: string | undefined;
  protocol: string;
  httpMethod: string;
  identity: APIGatewayEventIdentity;
  messageDirection?: string | undefined;
  messageId?: string | null | undefined;
  path: string;
  stage: string;
  requestId: string;
  requestTime?: string | undefined;
  requestTimeEpoch: number;
  resourceId: string;
  resourcePath: string;
  routeKey?: string | undefined;
};

type APIGatewayProxyEventPathParameters = {
  [name: string]: string | undefined;
};

type APIGatewayProxyEventStageVariables = {
  [name: string]: string | undefined;
};

type APIGatewayProxyEventQueryStringParameters = {
  [name: string]: string | undefined;
};

type APIGatewayProxyEventHeaders = {
  [name: string]: string | undefined;
};

type APIGatewayProxyEventMultiValueQueryStringParameters = {
  [name: string]: string[] | undefined;
};

type APIGatewayProxyEventMultiValueHeaders = {
  [name: string]: string[] | undefined;
};

export type APIGatewayProxyEventBase<TAuthorizerContext> = {
  body: string | null;
  headers: APIGatewayProxyEventHeaders;
  multiValueHeaders: APIGatewayProxyEventMultiValueHeaders;
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: APIGatewayProxyEventPathParameters | null;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
  multiValueQueryStringParameters: APIGatewayProxyEventMultiValueQueryStringParameters | null;
  stageVariables: APIGatewayProxyEventStageVariables | null;
  requestContext: APIGatewayEventRequestContextWithAuthorizer<TAuthorizerContext>;
  resource: string;
};

/**
 * Works with Lambda Proxy Integration for Rest API or HTTP API integration
 * Payload Format version 1.0
 *
 * @see - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export type APIGatewayProxyEvent =
  APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;

export type APIGatewayProxyResult = {
  statusCode: number;
  headers?:
    | {
        [header: string]: boolean | number | string;
      }
    | undefined;
  multiValueHeaders?:
    | {
        [header: string]: Array<boolean | number | string>;
      }
    | undefined;
  body: string;
  isBase64Encoded?: boolean | undefined;
};

export type APIGatewayProxyHandler = (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult>;
