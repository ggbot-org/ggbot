#!/usr/bin/env bash

AWS_REGION="eu-central-1"
RUNTIME="nodejs18.x"
# TODO create a ggbot2-main-api-role ggbot2-next-api-role ggbot2-local-api-role (copy of next)
ROLE="arn:aws:iam::$AWS_ACCOUNT_ID:role/ggbot2_api_role"

# Disable pagination.
export AWS_PAGER=""

ACTION_FUNCTION_NAME="ggbot2-${DEPLOY_STAGE}-stripe-api-action"
ACTION_FUNCTION_LOG_GROUP_NAME="/aws/lambda/$ACTION_FUNCTION_NAME"
ACTION_FUNCTION_ZIP_FILE="fileb://dist/action.zip"
ACTION_MEMORY_SIZE=256
ACTION_TIMEOUT=20
# TODO write this info in some test or typed code
# The number of days to retain the log events in the specified log group. Possible values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1096, 1827, 2192, 2557, 2922, 3288, and 3653.
ACTION_LOG_RETENTION_DAYS=365

WEBHOOK_FUNCTION_NAME="ggbot2-${DEPLOY_STAGE}-stripe-api-webhook"
WEBHOOK_FUNCTION_LOG_GROUP_NAME="/aws/lambda/$WEBHOOK_FUNCTION_NAME"
WEBHOOK_FUNCTION_ZIP_FILE="fileb://dist/webhook.zip"
WEBHOOK_MEMORY_SIZE=256
WEBHOOK_TIMEOUT=20
WEBHOOK_LOG_RETENTION_DAYS=365
