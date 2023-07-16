#!/usr/bin/env bash

AWS_REGION="us-east-1"
RUNTIME=nodejs18.x
# TODO create a ggbot2-main-api-role ggbot2-next-api-role ggbot2-local-api-role (copy of next)
ROLE=arn:aws:iam::$AWS_ACCOUNT_ID:role/ggbot2_api_role

ENTER_FUNCTION_NAME="ggbot2-${DEPLOY_STAGE}-auth-enter"
ENTER_FUNCTION_LOG_GROUP_NAME=/aws/lambda/$ENTER_FUNCTION_NAME
ENTER_FUNCTION_ZIP_FILE=fileb://dist/enter.zip

VERIFY_FUNCTION_NAME="ggbot2-${DEPLOY_STAGE}-auth-verify"
VERIFY_FUNCTION_LOG_GROUP_NAME=/aws/lambda/$VERIFY_FUNCTION_NAME
VERIFY_FUNCTION_ZIP_FILE="fileb://dist/verify.zip"
