#!/usr/bin/env bash

AWS_REGION="us-east-1"
RUNTIME=nodejs18.x
# TODO create a ggbot2-main-api-role ggbot2-next-api-role ggbot2-local-api-role (copy of next)
ROLE=arn:aws:iam::$AWS_ACCOUNT_ID:role/ggbot2_api_role

# Disable pagination.
export AWS_PAGER=""

ACTION_FUNCTION_NAME="ggbot2-${DEPLOY_STAGE}-auth-api-action"
ACTION_FUNCTION_LOG_GROUP_NAME="/aws/lambda/$ACTION_FUNCTION_NAME"
ACTION_FUNCTION_ZIP_FILE="fileb://dist/action.zip"
ACTION_MEMORY_SIZE=256
ACTION_TIMEOUT=10
ACTION_LOG_RETENTION_DAYS=7
